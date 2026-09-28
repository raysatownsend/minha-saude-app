#!/bin/bash
# Diagnóstico do cadastro. Rode da RAIZ do projeto:   bash diagnostico-cadastro.sh
#
# Não altera nada no seu projeto. Lê backend/.env e frontend/.env (sem mostrar
# senhas), testa o banco, o backend e o endereço que o app usa, e faz um
# cadastro de verdade com uma conta de teste (que é apagada no final).
# É um arquivo temporário: pode apagar depois de resolver.

cd "$(dirname "$0")" || exit 1
FALHAS=0
ok()      { echo "  [OK]       $1"; }
falha()   { echo "  [FALHA]    $1"; FALHAS=$((FALHAS+1)); }
atencao() { echo "  [ATENÇÃO]  $1"; }
dica()    { echo "             -> $1"; }

# lê CHAVE=valor de um .env (aceita aspas) sem imprimir nada além do valor
valor() {
  grep -E "^[[:space:]]*$2=" "$1" 2>/dev/null | tail -1 | sed -E \
    -e 's/^[^=]*=//' -e 's/^[[:space:]]+//' -e 's/[[:space:]]+$//' \
    -e 's/^"(.*)"$/\1/' -e "s/^'(.*)'\$/\\1/"
}
http() { curl -s -o /dev/null --max-time 5 -w '%{http_code}' "$1" 2>/dev/null; }
alcancavel() { [ -n "$1" ] && [ "$1" != "000" ]; }

echo "=============================================="
echo " Diagnóstico do cadastro — Minha Saúde"
echo "=============================================="

# ---------------------------------------------------------------- 1
echo
echo "1) Arquivos de configuração"
if [ -f backend/.env ]; then ok "backend/.env existe"
else falha "backend/.env não existe (o NestJS só lê um arquivo chamado exatamente .env; .env.local não vale)"; fi
if [ -f frontend/.env ]; then ok "frontend/.env existe"
else falha "frontend/.env não existe"; fi
for k in DB_HOST DB_USER DB_PASSWORD DB_NAME JWT_SECRET; do
  if [ -n "$(valor backend/.env $k)" ]; then ok "backend/.env tem $k"
  else falha "backend/.env está sem $k (ou vazio)"; fi
done

DBH=$(valor backend/.env DB_HOST)
DBPORT=$(valor backend/.env DB_PORT); DBPORT=${DBPORT:-3306}
DBU=$(valor backend/.env DB_USER)
DBW=$(valor backend/.env DB_PASSWORD)
DBN=$(valor backend/.env DB_NAME)
PORTA=$(valor backend/.env PORT); PORTA=${PORTA:-3000}
API=$(valor frontend/.env EXPO_PUBLIC_API_URL); API=${API%/}

# ---------------------------------------------------------------- 2
echo
echo "2) Banco de dados (o mesmo que o backend usa)"
MYSQL_BIN=$(command -v mysql)
if [ -z "$MYSQL_BIN" ] && [ -x /usr/local/mysql/bin/mysql ]; then MYSQL_BIN=/usr/local/mysql/bin/mysql; fi

# só conta processo cujo EXECUTÁVEL é o servidor do MySQL (não qualquer linha que cite as palavras)
modo_seguro() {
  ps -axww -o command= 2>/dev/null | awk '
    { n = split($1, p, "/"); b = p[n] }
    (b == "mysqld" || b == "mysqld_safe" || b == "mariadbd") && ($0 ~ /skip-grant-tables/ || $0 ~ /skip-networking/) { achou = 1 }
    END { exit !achou }'
}
if modo_seguro; then
  falha "o MySQL está rodando em MODO SEGURO (--skip-grant-tables / --skip-networking), sobra da recuperação de senha. Nesse modo ele não aceita conexão do backend."
  dica "pare e suba do jeito normal:  sudo pkill mysqld ; sudo /usr/local/mysql/support-files/mysql.server start"
fi

if [ -z "$MYSQL_BIN" ]; then
  atencao "comando 'mysql' não encontrado; pulei o teste de conexão com o banco"
elif [ -z "$DBH" ] || [ -z "$DBU" ] || [ -z "$DBN" ]; then
  atencao "faltam dados do banco no backend/.env (veja o item 1); pulei o teste"
else
  SAIDA=$(MYSQL_PWD="$DBW" "$MYSQL_BIN" --protocol=TCP --connect-timeout=5 -h "$DBH" -P "$DBPORT" -u "$DBU" -e "SELECT 1" "$DBN" 2>&1); COD=$?
  if [ $COD -eq 0 ]; then
    ok "conectou em $DBH:$DBPORT como '$DBU'; o banco '$DBN' existe"
    if ! MYSQL_PWD="$DBW" "$MYSQL_BIN" --protocol=TCP -h "$DBH" -P "$DBPORT" -u "$DBU" -N -e "SELECT 1 FROM Usuario LIMIT 1" "$DBN" >/dev/null 2>&1; then
      atencao "a tabela Usuario ainda não existe: o backend nunca chegou a subir com sucesso nesse banco (ele cria as tabelas sozinho ao iniciar)"
    else
      TEM=$(MYSQL_PWD="$DBW" "$MYSQL_BIN" --protocol=TCP -h "$DBH" -P "$DBPORT" -u "$DBU" -N -e "SHOW COLUMNS FROM Usuario LIKE 'linkPublicoId'" "$DBN" 2>/dev/null)
      if [ -n "$TEM" ]; then ok "a tabela Usuario está na versão nova (tem linkPublicoId)"
      else
        falha "a tabela Usuario está DESATUALIZADA (sem a coluna linkPublicoId)"
        dica "o backend que está rodando não é a versão nova. Recompile e reinicie:  cd backend && npx tsc -p tsconfig.build.json && node dist/main.js"
        dica "se persistir, recrie o banco:  DROP DATABASE $DBN; CREATE DATABASE $DBN;"
      fi
    fi
  elif echo "$SAIDA" | grep -qi "access denied"; then
    falha "o MySQL recusou o usuário/senha do backend/.env (usuário '$DBU')"
    dica "confira DB_USER e DB_PASSWORD: têm que ser a senha NOVA que você definiu no reset"
  elif echo "$SAIDA" | grep -qi "unknown database"; then
    falha "o banco '$DBN' não existe"
    dica "crie no Workbench:  CREATE DATABASE $DBN;"
  else
    falha "não consegui conectar em $DBH:$DBPORT"
    echo "$SAIDA" | sed 's/^/             | /'
    dica "MySQL desligado ou em modo seguro? confira com:  ps aux | grep mysqld"
  fi
fi

# ---------------------------------------------------------------- 3
echo
echo "3) Backend"
CB=$(http "http://127.0.0.1:$PORTA/")
if alcancavel "$CB"; then
  ok "backend respondendo em http://127.0.0.1:$PORTA (HTTP $CB na raiz; 404 é o normal)"
else
  falha "nada respondendo em http://127.0.0.1:$PORTA: o backend não está rodando (ou caiu ao subir)"
  if [ -f backend/dist/main.js ]; then
    dica "rode, dentro de backend/:  node dist/main.js   e olhe se aparece algum erro no terminal"
  else
    dica "backend/dist/main.js não existe. Dentro de backend/:  npx tsc -p tsconfig.build.json   e depois   node dist/main.js"
  fi
fi

# ---------------------------------------------------------------- 4
echo
echo "4) Endereço que o app usa (frontend/.env)"
CA=""
if [ -z "$API" ]; then
  falha "EXPO_PUBLIC_API_URL não está definida no frontend/.env"
else
  echo "             EXPO_PUBLIC_API_URL = $API"
  case "$API" in
    http://*|https://*) ;;
    *) falha "o endereço precisa começar com http://" ;;
  esac
  HOST=$(echo "$API" | sed -E 's#^https?://([^:/]+).*#\1#')
  MEUS=$( { ipconfig getifaddr en0; ipconfig getifaddr en1; hostname -I; } 2>/dev/null | tr '\n' ' ')
  [ -n "$MEUS" ] && echo "             IP(s) desta máquina agora: $MEUS"
  CA=$(http "$API/")
  if alcancavel "$CA"; then
    ok "esta máquina chega em $API (HTTP $CA)"
  else
    falha "esta máquina NÃO consegue chegar em $API"
    case "$HOST" in
      localhost|127.0.0.1) dica "confira se o backend está rodando (item 3) e se a porta é $PORTA" ;;
      *)
        if [ -n "$MEUS" ] && ! echo " $MEUS " | grep -q " $HOST "; then
          dica "o IP $HOST NÃO é o IP desta máquina agora. Troque no frontend/.env por:  EXPO_PUBLIC_API_URL=http://<um dos IPs acima>:$PORTA"
        else
          dica "o IP parece certo; confira se o backend está rodando e se o firewall do Mac não bloqueou o node"
        fi ;;
    esac
    dica "depois de mexer no .env:  cd frontend && npx expo start -c   (o -c é obrigatório: o endereço fica gravado no app ao iniciar)"
  fi
  case "$HOST" in
    localhost|127.0.0.1) atencao "'$HOST' só funciona no simulador do iPhone; em celular de verdade use o IP da máquina" ;;
  esac
fi

# ---------------------------------------------------------------- 5
echo
echo "5) Teste real de cadastro (cria e apaga uma conta de teste)"
ALVO=""
if alcancavel "$CA"; then ALVO="$API"
elif alcancavel "$CB"; then
  ALVO="http://127.0.0.1:$PORTA"
  atencao "testando em 127.0.0.1, porque o endereço do app não responde (item 4)"
fi

if [ -z "$ALVO" ]; then
  atencao "nenhum backend acessível; não deu pra testar o cadastro"
else
  U="diagnostico-$(date +%s)@teste.com"
  PAYLOAD=$(printf '{"nome":"Teste","sobrenome":"Diagnostico","username":"%s","password":"senha123","sexo":"Feminino","enderecoCompleto":"Rua Teste, 1","contatoEmergencia":{"nome":"Contato","telefone":"51999990000"},"tipoSangue":"O+"}' "$U")
  RESP=$(curl -s --max-time 20 -w '\n%{http_code}' -X POST "$ALVO/usuarios" -H 'Content-Type: application/json' -d "$PAYLOAD" 2>/dev/null)
  CODE=$(printf '%s' "$RESP" | tail -n 1)
  CORPO=$(printf '%s' "$RESP" | sed '$d')
  case "$CODE" in
    201)
      ok "cadastro funcionou (HTTP 201): backend e banco estão bem"
      TOK=$(curl -s --max-time 10 -X POST "$ALVO/auth/login" -H 'Content-Type: application/json' \
            -d "{\"username\":\"$U\",\"password\":\"senha123\"}" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
      if [ -n "$TOK" ]; then
        ok "login da conta de teste funcionou"
        D=$(curl -s -o /dev/null --max-time 10 -w '%{http_code}' -X DELETE "$ALVO/usuarios/me" -H "Authorization: Bearer $TOK")
        if [ "$D" = "204" ]; then ok "conta de teste apagada"
        else atencao "não consegui apagar a conta de teste ($U); pode apagar pelo Workbench"; fi
      else
        atencao "criou mas o login falhou; apague a conta $U pelo Workbench"
      fi ;;
    400) falha "o backend recusou os dados (HTTP 400):"; echo "             | $CORPO" ;;
    409) atencao "e-mail de teste já existia (HTTP 409); rode de novo" ;;
    000|"") falha "sem resposta do backend em $ALVO" ;;
    5*)
      falha "o backend respondeu ERRO INTERNO (HTTP $CODE). O motivo está impresso no terminal onde o backend roda."
      dica "copie de lá o bloco de erro (começa com [Nest] ... ERROR) e me mande" ;;
    *) falha "resposta inesperada (HTTP $CODE): $CORPO" ;;
  esac
fi

# ---------------------------------------------------------------- fim
echo
echo "=============================================="
if [ "$FALHAS" -eq 0 ]; then
  echo " Sem falhas do lado do computador."
  echo " Se o app ainda mostrar erro: feche o Expo e rode  cd frontend && npx expo start -c"
else
  echo " $FALHAS problema(s) acima. Resolva de cima para baixo (o primeiro costuma causar"
  echo " os seguintes) e rode de novo."
fi
echo "=============================================="
exit $FALHAS

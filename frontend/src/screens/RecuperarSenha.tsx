import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Key, Mail } from 'lucide-react-native';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';

export default function RecuperarSenha() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [segundos, setSegundos] = useState(42);

  // Só UM intervalo, criado quando a tela monta (por isso o array de
  // dependências vazio, "[]"). A cada segundo ele diminui 1 do
  // contador. Usar a forma "s => s - 1" (em vez de "segundos - 1")
  // evita ter que colocar "segundos" nas dependências — senão o
  // efeito recriaria um intervalo novo a cada tick, sem necessidade.
  useEffect(() => {
    const id = setInterval(() => {
      setSegundos((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id); // limpa o intervalo ao sair da tela
  }, []);

  const tempoFormatado = `00:${String(segundos).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recuperar senha</Text>
      </View>

      <View style={styles.iconCircle}>
        <Key color={colors.primary} size={28} />
      </View>

      <Text style={styles.titulo}>Esqueceu a senha?</Text>
      <Text style={styles.subtitulo}>
        Informe o e-mail cadastrado e enviaremos um link seguro para criar
        uma nova senha.
      </Text>

      <Input
        label="E-MAIL"
        placeholder="raysa@email.com"
        icon={Mail}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <AppButton
        title="Enviar link de recuperação"
        onPress={() => {}}
        style={styles.botao}
      />

      <View style={styles.avisoBox}>
        <Text style={styles.avisoTexto}>
          O link expira em 30 minutos. Não recebeu?{' '}
          {segundos > 0 ? (
            <Text style={styles.avisoLink}>Reenviar em {tempoFormatado}</Text>
          ) : (
            <Text style={styles.avisoLink} onPress={() => setSegundos(42)}>
              Reenviar
            </Text>
          )}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 21,
  },
  botao: {
    marginTop: 8,
  },
  avisoBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  avisoTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  avisoLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

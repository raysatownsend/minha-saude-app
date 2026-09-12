# minha-saude-app
Desenvolvimento de aplicativo para a disciplina integradora de projetos do Curso de Desenvolvimento de Sistemas Full-Stack da PUCRS.

## Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior (recomendado: versão LTS)
- npm (já vem junto com o Node) ou yarn
- Para testar em iPhone: macOS + [Xcode](https://apps.apple.com/br/app/xcode/id497799835) instalado, com o Simulador de iOS
- Para testar em Android: [Android Studio](https://developer.android.com/studio) com um emulador configurado
- Alternativa sem instalar nada disso: o app [Expo Go](https://expo.dev/go), baixado num celular físico (iOS ou Android)

### Frontend (React Native + Expo) e Backend

1. Clone o repositório e entre na pasta:
   ```bash
   git clone https://github.com/raysatownsend/minha-saude-app.git
   cd minha-saude-app
   ```

2. Instale as dependências do backend e do frontend:
    cd backend
   ```bash
   npm install
   ```
    cd frontend
   ```bash
   npm install
   ```

3. Inicie o servidor backend e frontend (Expo):
    npm start (após rodar o comando acima no backend)
    npx expo start (após rodar o comando acima no frontend)

    ** Certifique-se de estar no diretorio backend ou frontend para rodar os comandos.

4. Abra o app de uma dessas formas após iniciar o servidor do frontend:
   - Pressione `i` no terminal → abre no Simulador de iOS (só macOS)
   - Pressione `a` no terminal → abre num emulador Android
   - Escaneie o QR code exibido no terminal com a câmera do celular (iOS) ou com o app Expo Go (Android), usando um celular físico

> **Nota sobre o QR code de emergência do app:** a tela "QR Code de emergência" usa um esquema de link próprio (`minhasaude://`) para abrir a página de senha pública diretamente dentro do app. Isso só funciona numa build de desenvolvimento — `npx expo run:ios` ou `npx expo run:android` — e não dentro do Expo Go, que não reconhece esquemas de apps de terceiros.

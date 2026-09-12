// src/navigation/RootNavigator.tsx
//
// Duas partes:
// 1) MainTabs — o Tab.Navigator das 4 abas de baixo. Em vez da barra
//    padrão do React Navigation, ele usa o SEU BottomNav como
//    "tabBar" (prop tabBar), então o visual continua sendo o que a
//    gente já construiu, só que agora trocando de tela de verdade.
// 2) RootStack — empilha o fluxo de login (Login/Cadastro/
//    RecuperarSenha), o MainTabs inteiro como se fosse uma tela só,
//    e as telas de detalhe (Exames, Medicos, Senhas, ExcluirConta)
//    que "empilham por cima" das abas — é por isso que elas ficam
//    sem a barra de baixo quando abertas: não fazem parte do
//    Tab.Navigator, são telas irmãs dele dentro do RootStack.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import BottomNav, { type NavTab } from '../components/BottomNav';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import RecuperarSenha from '../screens/RecuperarSenha';
import Home from '../screens/Home';
import Clinico from '../screens/Clinico';
import QrCodeScreen from '../screens/QRCode';
import Perfil from '../screens/Perfil';
import Exames from '../screens/Exames';
import Medicos from '../screens/Medicos';
import Senhas from '../screens/Senhas';
import ExcluirConta from '../screens/ExcluirConta';
import DetalheClinico from '../screens/DetalheClinico';
import EditarClinico from '../screens/EditarClinico';
import EditarPerfil from '../screens/EditarPerfil';
import PublicaBloqueada from '../screens/PublicaBloqueada';
import PublicaLiberada from '../screens/PublicaLiberada';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// traduz o "state" do React Navigation pro formato que o BottomNav
// já esperava (active + onNavigate) — assim não precisou mudar nada
// no BottomNav em si.
function TabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routes[state.index].name as NavTab;
  return (
    <BottomNav
      active={active}
      onNavigate={(tab) => navigation.navigate(tab)}
    />
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="inicio" component={Home} />
      <Tab.Screen name="clinico" component={Clinico} />
      <Tab.Screen name="qrcode" component={QrCodeScreen} />
      <Tab.Screen name="perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Exames" component={Exames} />
      <Stack.Screen name="Medicos" component={Medicos} />
      <Stack.Screen name="Senhas" component={Senhas} />
      <Stack.Screen name="ExcluirConta" component={ExcluirConta} />
      <Stack.Screen name="DetalheClinico" component={DetalheClinico} />
      <Stack.Screen name="EditarClinico" component={EditarClinico} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
      {/* essas duas eu registrei aqui só pra você conseguir testar
          (navigation.navigate('PublicaLiberada')) — no app real elas
          tendem a ser uma página web separada, não uma tela do app;
          é a ressalva que te fiz na mensagem anterior. */}
      <Stack.Screen name="PublicaBloqueada" component={PublicaBloqueada} />
      <Stack.Screen name="PublicaLiberada" component={PublicaLiberada} />
    </Stack.Navigator>
  );
}

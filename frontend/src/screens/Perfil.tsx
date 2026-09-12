// src/screens/Perfil.tsx
//
// Virou a versão de LEITURA — nome, e-mail e dados como texto, não
// como Input editável. "Editar" abre o EditarPerfil.tsx. A seção
// CONTA continua aqui (são links de navegação, não campos de dado).

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Lock, MapPin, Stethoscope, Trash2, User } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';

export default function Perfil() {
  // "any" pelo mesmo motivo de sempre: precisa navegar pra fora do
  // Tab.Navigator (EditarPerfil, Medicos, Senhas, ExcluirConta).
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Meu perfil"
          rightLabel="Editar"
          onRightPress={() => navigation.navigate('EditarPerfil')}
        />

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>RC</Text>
        </View>
        <Text style={styles.nomeCompleto}>Raysa Carraro</Text>
        <Text style={styles.email}>raysa@email.com</Text>

        <InfoRow icon={User} title="Sexo" subtitle="Feminino" />
        <InfoRow
          icon={Calendar}
          title="Data de nascimento"
          subtitle="14/02/1988"
        />
        <InfoRow
          icon={MapPin}
          title="Endereço"
          subtitle="Rua das Acácias, 210 · Porto Alegre"
        />

        <Text style={styles.secaoTitulo}>CONTA</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Medicos')}>
          <InfoRow
            icon={Stethoscope}
            title="Meus médicos"
            subtitle="Contatos de emergência"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Senhas')}>
          <InfoRow
            icon={Lock}
            title="Senhas e segurança"
            subtitle="Senha do app e senha pública do QR Code"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ExcluirConta')}>
          <InfoRow
            icon={Trash2}
            title="Excluir conta"
            subtitle="Apagar dados permanentemente"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 24,
    paddingBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarTexto: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nomeCompleto: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 12,
  },
});

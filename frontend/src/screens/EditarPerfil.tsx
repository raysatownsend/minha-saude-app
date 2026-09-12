// src/screens/EditarPerfil.tsx
//
// Formulário de edição do perfil. Antes, esses campos editáveis e
// os links de conta (Médicos, Senhas, Excluir) estavam juntos no
// Perfil.tsx — separei porque são coisas diferentes: editar dado
// vs. navegar pra outra tela. O "Editar" do Perfil abre isto.

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Camera, MapPin, User } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import { colors } from '../../colors';

export default function EditarPerfil() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('Raysa');
  const [sobrenome, setSobrenome] = useState('Townsend Carraro');
  const [sexo, setSexo] = useState('Feminino');
  const [nascimento, setNascimento] = useState('14/02/1988');
  const [endereco, setEndereco] = useState(
    'Rua das Acácias, 210 · Porto Alegre'
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Editar perfil"
          onBack={() => navigation.goBack()}
          rightLabel="Salvar"
          onRightPress={() => navigation.goBack()}
        />

        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>RC</Text>
          </View>
          <TouchableOpacity style={styles.cameraBotao}>
            <Camera color="#fff" size={16} />
          </TouchableOpacity>
        </View>

        <Input label="NOME" icon={User} value={nome} onChangeText={setNome} />
        <Input
          label="SOBRENOME"
          value={sobrenome}
          onChangeText={setSobrenome}
        />
        <Input label="SEXO" value={sexo} onChangeText={setSexo} />
        <Input
          label="DATA DE NASCIMENTO"
          icon={Calendar}
          value={nascimento}
          onChangeText={setNascimento}
        />
        <Input
          label="ENDEREÇO COMPLETO"
          icon={MapPin}
          value={endereco}
          onChangeText={setEndereco}
        />
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
    paddingBottom: 40,
  },
  avatarArea: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cameraBotao: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
});

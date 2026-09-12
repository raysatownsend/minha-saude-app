import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['minhasaude://', 'https://minhasaude.app'],
  config: {
    screens: {
      // .../s/9f27bd (do link ou do QR code) -> tela PublicaBloqueada,
      // com "9f27bd" preenchendo o parâmetro "codigo" sozinho
      PublicaBloqueada: 's/:codigo',
    },
  },
};

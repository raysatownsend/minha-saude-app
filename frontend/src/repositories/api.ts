import axios from 'axios';
import { obterToken } from '../services/tokenStorage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL não está definida — confira o .env');
}

export const api = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Roda antes de toda requisição — inclusive as de login/cadastro/
// página pública, que não têm token nenhum ainda. Não tem problema:
// sem token salvo, o header simplesmente não é adicionado, e essas
// rotas nem exigem ele no backend (não têm @UseGuards).
api.interceptors.request.use(async (config) => {
  const token = await obterToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
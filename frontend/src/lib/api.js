import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('inn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('inn_token');
      localStorage.removeItem('inn_user');
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => api.post('/auth/register', data).then((r) => r.data);
export const login = (data) => api.post('/auth/login', data).then((r) => r.data);
export const me = () => api.get('/auth/me').then((r) => r.data);

// Frete
export const calcularFrete = (payload) => api.post('/frete/calcular', payload).then((r) => r.data);

// Envios
export const criarEnvio = (payload) => api.post('/envios', payload).then((r) => r.data);
export const listarEnvios = () => api.get('/envios').then((r) => r.data);
export const enviosStats = () => api.get('/envios/stats').then((r) => r.data);

// Wallet
export const walletSaldo = () => api.get('/wallet/saldo').then((r) => r.data);
export const walletRecarga = (valor, metodo = 'pix') => api.post('/wallet/recarga', { valor, metodo }).then((r) => r.data);
export const walletExtrato = () => api.get('/wallet/extrato').then((r) => r.data);

// Rastreio
export const rastrear = (codigo) => api.get(`/rastreio/${codigo}`).then((r) => r.data);

export default api;

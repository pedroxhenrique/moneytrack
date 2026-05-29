/**
 * MoneyTrack - Cliente da API
 * Detecta automaticamente se está rodando local ou em produção
 */

// IMPORTANTE: Ao fazer deploy, substitua a URL abaixo pela URL do Railway
const RAILWAY_URL = 'https://SEU-PROJETO.up.railway.app';

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api/v1'
  : `${RAILWAY_URL}/api/v1`;

const request = async (method, endpoint, body = null) => {
  const token = localStorage.getItem('mt_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem('mt_token');
      localStorage.removeItem('mt_usuario');
      window.location.href = window.location.pathname.includes('/pages/')
        ? '../index.html' : 'index.html';
      return;
    }

    return { ok: response.ok, status: response.status, data };
  } catch (err) {
    console.error('Erro na requisição:', err);
    throw err;
  }
};

const api = {
  auth: {
    cadastro: (d) => request('POST', '/auth/cadastro', d),
    login:    (d) => request('POST', '/auth/login', d),
    perfil:   ()  => request('GET',  '/auth/perfil'),
  },
  categorias: {
    listar:   ()      => request('GET',    '/categorias'),
    criar:    (d)     => request('POST',   '/categorias', d),
    atualizar:(id, d) => request('PUT',    `/categorias/${id}`, d),
    excluir:  (id)    => request('DELETE', `/categorias/${id}`),
  },
  transacoes: {
    listar: (filtros = {}) => {
      const p = new URLSearchParams();
      if (filtros.dataInicio)  p.append('dataInicio',  filtros.dataInicio);
      if (filtros.dataFim)     p.append('dataFim',     filtros.dataFim);
      if (filtros.categoriaId) p.append('categoriaId', filtros.categoriaId);
      const q = p.toString();
      return request('GET', `/transacoes${q ? '?' + q : ''}`);
    },
    criar:    (d)     => request('POST',   '/transacoes', d),
    atualizar:(id, d) => request('PUT',    `/transacoes/${id}`, d),
    excluir:  (id)    => request('DELETE', `/transacoes/${id}`),
  },
  saldo: {
    obter: () => request('GET', '/saldo'),
  },
  relatorios: {
    gastos: (filtros = {}) => {
      const p = new URLSearchParams();
      if (filtros.dataInicio) p.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim)    p.append('dataFim',    filtros.dataFim);
      const q = p.toString();
      return request('GET', `/relatorios/gastos${q ? '?' + q : ''}`);
    },
  },
};

window.api = api;

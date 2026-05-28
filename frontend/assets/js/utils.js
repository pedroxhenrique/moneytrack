/**
 * MoneyTrack - Utilitários
 */

// ── Formatar moeda ──
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
};

// ── Formatar data ──
const formatarData = (data) => {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

// ── Data de hoje no formato YYYY-MM-DD ──
const hoje = () => {
  return new Date().toISOString().split('T')[0];
};

// ── Primeiro dia do mês atual ──
const primeiroDiaMes = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

// ── Mostrar alerta ──
const mostrarAlerta = (elementoId, mensagem, tipo = 'erro') => {
  const el = document.getElementById(elementoId);
  if (!el) return;
  el.textContent = mensagem;
  el.className = `alert alert-${tipo}`;
  el.classList.remove('alert-hidden');
  setTimeout(() => el.classList.add('alert-hidden'), 5000);
};

// ── Obter usuário logado do localStorage ──
const getUsuario = () => {
  const raw = localStorage.getItem('mt_usuario');
  return raw ? JSON.parse(raw) : null;
};

// ── Salvar dados de login ──
const salvarLogin = (token, usuario) => {
  localStorage.setItem('mt_token', token);
  localStorage.setItem('mt_usuario', JSON.stringify(usuario));
};

// ── Logout ──
const logout = () => {
  localStorage.removeItem('mt_token');
  localStorage.removeItem('mt_usuario');
  window.location.href = '/index.html';
};

// ── Iniciar navbar ──
const iniciarNavbar = () => {
  const usuario = getUsuario();
  if (!usuario) return;

  const nomeEl = document.getElementById('navbar-nome');
  const emailEl = document.getElementById('navbar-email');
  const avatarEl = document.getElementById('navbar-avatar');
  const btnSair = document.getElementById('btn-sair');

  if (nomeEl) nomeEl.textContent = usuario.nome;
  if (emailEl) emailEl.textContent = usuario.email;
  if (avatarEl) avatarEl.textContent = usuario.nome.charAt(0).toUpperCase();
  if (btnSair) btnSair.addEventListener('click', logout);

  // Marcar item ativo da navbar
  const paginaAtual = window.location.pathname.split('/').pop();
  document.querySelectorAll('.navbar-item[data-page]').forEach(item => {
    if (item.dataset.page === paginaAtual) {
      item.classList.add('ativo');
    }
  });
};

// ── Confirmar exclusão ──
const confirmarExclusao = (mensagem = 'Tem certeza que deseja excluir?') => {
  return window.confirm(mensagem);
};

window.formatarMoeda = formatarMoeda;
window.formatarData = formatarData;
window.hoje = hoje;
window.primeiroDiaMes = primeiroDiaMes;
window.mostrarAlerta = mostrarAlerta;
window.getUsuario = getUsuario;
window.salvarLogin = salvarLogin;
window.logout = logout;
window.iniciarNavbar = iniciarNavbar;
window.confirmarExclusao = confirmarExclusao;

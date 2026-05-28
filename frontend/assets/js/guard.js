/**
 * MoneyTrack - Guard de Autenticação
 * Redireciona para login se não estiver autenticado
 * Incluir em todas as páginas protegidas (dashboard, transações, etc)
 */

(function () {
  const token = localStorage.getItem('mt_token');
  const usuario = localStorage.getItem('mt_usuario');

  if (!token || !usuario) {
    window.location.href = '/index.html';
  }
})();

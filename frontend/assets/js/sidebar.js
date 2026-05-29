function renderSidebar(paginaAtual) {
  const base = window.location.pathname.includes('/pages/') ? '../' : '';
  const html = `
  <div class="user-avatar-mobile" id="avatar-mobile" onclick="window.location.href='${base}pages/perfil.html'" title="Meu Perfil">P</div>
  <nav class="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon"><i class="ti ti-trending-up"></i></div>
      <div class="sidebar-logo-text">Money<span>Track</span></div>
    </div>
    <div class="sidebar-nav">
      <div class="sidebar-group">Principal</div>
      <a href="${base}pages/dashboard.html" class="sidebar-item ${paginaAtual==='dashboard'?'ativo':''}" title="Dashboard">
        <i class="ti ti-layout-dashboard"></i><span>Dashboard</span>
      </a>
      <a href="${base}pages/transacoes.html" class="sidebar-item ${paginaAtual==='transacoes'?'ativo':''}" title="Transações">
        <i class="ti ti-arrows-exchange"></i><span>Transações</span>
      </a>
      <a href="${base}pages/categorias.html" class="sidebar-item ${paginaAtual==='categorias'?'ativo':''}" title="Categorias">
        <i class="ti ti-tag"></i><span>Categorias</span>
      </a>
      <div class="sidebar-group">Análise</div>
      <a href="${base}pages/relatorios.html" class="sidebar-item ${paginaAtual==='relatorios'?'ativo':''}" title="Relatórios">
        <i class="ti ti-chart-pie"></i><span>Relatórios</span>
      </a>
      <a href="${base}pages/mensal.html" class="sidebar-item ${paginaAtual==='mensal'?'ativo':''}" title="Resumo Mensal">
        <i class="ti ti-calendar-stats"></i><span>Resumo Mensal</span>
      </a>
      <a href="${base}pages/metas.html" class="sidebar-item ${paginaAtual==='metas'?'ativo':''}" title="Metas">
        <i class="ti ti-target"></i><span>Metas</span>
      </a>
      <a href="${base}pages/salario.html" class="sidebar-item ${paginaAtual==='salario'?'ativo':''}" title="Salário">
        <i class="ti ti-cash"></i><span>Salário</span>
        <span class="sidebar-badge verde">Novo</span>
      </a>
      <div class="sidebar-group">Conta</div>
      <a href="${base}pages/perfil.html" class="sidebar-item sidebar-desktop-only ${paginaAtual==='perfil'?'ativo':''}" title="Perfil">
        <i class="ti ti-user-circle"></i><span>Meu Perfil</span>
      </a>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-avatar" id="sidebar-avatar">P</div>
        <div style="overflow:hidden">
          <div class="sidebar-user-nome" id="sidebar-nome">Carregando...</div>
          <div class="sidebar-user-email" id="sidebar-email"></div>
        </div>
      </div>
      <button class="btn-sair" id="btn-sair"><i class="ti ti-logout"></i><span>Sair</span></button>
    </div>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  const usuario = getUsuario();
  if (usuario) {
    const inicial = usuario.nome.charAt(0).toUpperCase();
    ['sidebar-nome','sidebar-email','sidebar-avatar','avatar-mobile'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'sidebar-nome') el.textContent = usuario.nome;
      else if (id === 'sidebar-email') el.textContent = usuario.email;
      else el.textContent = inicial;
    });
  }
  document.getElementById('btn-sair')?.addEventListener('click', logout);
}
window.renderSidebar = renderSidebar;
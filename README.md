# 💰 MoneyTrack — Sistema de Controle de Gastos Pessoais

> **Projeto Tecnológico** — ULBRA EAD — Análise e Desenvolvimento de Sistemas
> **Autor:** Pedro Henrique da Silva Santos

---

## 🚀 Como rodar LOCALMENTE

```bash
cd backend
npm install
copy .env.example .env    # Windows
npm run init-db
npm run dev
```

Abra `frontend/index.html` com o Live Server do VS Code.

---

## 🌐 Como fazer DEPLOY

### 1. Back-end no Railway

1. Acesse https://railway.app → Login with GitHub
2. New Project → Deploy from GitHub repo → selecione `moneytrack`
3. Configure Root Directory: `backend`
4. Adicione um serviço MySQL: **+ New → Database → MySQL**
5. O Railway preenche `DATABASE_URL` automaticamente
6. Adicione as variáveis:
   ```
   JWT_SECRET=moneytrack_producao_2026_chave_forte
   NODE_ENV=production
   FRONTEND_URL=https://seu-projeto.vercel.app
   ```

### 2. Front-end no Vercel

1. No arquivo `frontend/assets/js/api.js`, substitua:
   ```
   const RAILWAY_URL = 'https://SEU-PROJETO.up.railway.app';
   ```
   pela URL real do Railway

2. Acesse https://vercel.com → Login with GitHub
3. New Project → selecione `moneytrack`
4. Root Directory: `frontend`
5. Framework Preset: **Other**
6. Deploy!

---

## 📋 Funcionalidades

- ✅ Cadastro e autenticação (JWT + bcrypt)
- ✅ Dashboard com saldo em tempo real
- ✅ CRUD de Transações (entradas e saídas)
- ✅ Filtros por período e categoria
- ✅ Gerenciamento de categorias personalizadas
- ✅ Relatórios com gráficos (pizza + barras)
- ✅ Resumo mensal comparativo
- ✅ Metas de gastos por categoria
- ✅ Layout responsivo (mobile + desktop)

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Front-end | HTML5, CSS3, JavaScript |
| Back-end | Node.js + Express |
| Banco (local) | SQLite (sql.js) |
| Banco (produção) | MySQL |
| Autenticação | JWT + bcrypt |
| Deploy Back | Railway |
| Deploy Front | Vercel |

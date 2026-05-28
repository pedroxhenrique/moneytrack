# MoneyTrack — Back-end

API REST do sistema de controle de gastos pessoais MoneyTrack.

## 🛠️ Tecnologias

- **Node.js + Express** — servidor web
- **SQLite 3** — banco de dados (arquivo único, sem servidor)
- **JWT** — autenticação
- **bcrypt** — hash de senhas

## 📋 Pré-requisitos

- **Node.js 18+** instalado ([baixar aqui](https://nodejs.org))
- **NPM** (vem junto com o Node.js)

> ⚠️ **Não precisa de XAMPP, MySQL ou phpMyAdmin!**
> O SQLite é um banco em arquivo único, super simples.

## 🚀 Como rodar localmente (3 passos)

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Inicializar o banco de dados

```bash
npm run init-db
```

✅ Isso vai criar o arquivo `database/moneytrack.db` com as 3 tabelas.

### 3. Iniciar o servidor

**Modo desenvolvimento** (recomendado, reinicia ao salvar):
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

🎉 A API estará disponível em: **http://localhost:3000**

## ✅ Verificar se está funcionando

Acesse no navegador: http://localhost:3000

Você deve ver uma resposta JSON confirmando que a API está online.

## 📁 Estrutura

```
backend/
├── src/
│   ├── config/        → Conexão SQLite + inicialização
│   ├── controllers/   → Lógica das rotas
│   ├── services/      → Regras de negócio
│   ├── models/        → Queries SQL
│   ├── middlewares/   → Auth, validação, erros
│   ├── routes/        → Endpoints da API
│   ├── utils/         → Funções auxiliares
│   └── server.js      → Ponto de entrada
├── database/
│   ├── schema.sql     → Script das tabelas
│   └── moneytrack.db  → Banco SQLite (criado automaticamente)
└── package.json
```

## 🗄️ Visualizar o banco de dados

Instale a extensão **"SQLite Viewer"** no VS Code:
1. Abra o VS Code
2. Vá em Extensions (Ctrl + Shift + X)
3. Procure por **"SQLite Viewer"** (autor: Florian Klampfer)
4. Instale
5. Clique no arquivo `database/moneytrack.db` no VS Code
6. ✅ Você vê as tabelas como no phpMyAdmin!

## 📝 Sobre a escolha do SQLite

O projeto original previa MySQL, mas optou-se pelo **SQLite** pelas vantagens:
- ✅ Zero configuração (sem XAMPP, sem servidor)
- ✅ Mesma estrutura relacional (3 tabelas, FKs, integridade referencial)
- ✅ Sintaxe SQL praticamente idêntica
- ✅ Maior portabilidade para deploy em cloud gratuita
- ✅ Backup é trivial (apenas copiar o arquivo)

**O modelo de dados (DER) permanece idêntico ao documentado na Etapa de Projeto.**

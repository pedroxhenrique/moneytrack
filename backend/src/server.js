/**
 * MoneyTrack - Servidor Principal
 * Autor: Pedro Henrique da Silva Santos
 *
 * Ponto de entrada da aplicação back-end
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { sucesso, erro } = require('./utils/responseHelper');

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES GLOBAIS
// =====================================================

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// =====================================================
// ROTAS
// =====================================================

app.get('/', (req, res) => {
  return sucesso(res, 'API MoneyTrack está online! 🚀', {
    nome: 'MoneyTrack API',
    versao: '1.0.0',
    autor: 'Pedro Henrique da Silva Santos',
    banco: 'SQLite 3 (via sql.js)',
    endpoints: {
      auth: '/api/v1/auth',
      transacoes: '/api/v1/transacoes',
      categorias: '/api/v1/categorias',
      saldo: '/api/v1/saldo',
      relatorios: '/api/v1/relatorios'
    }
  });
});

// Rotas da API
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/categorias', require('./routes/categoriaRoutes'));
app.use('/api/v1/transacoes', require('./routes/transacaoRoutes'));
app.use('/api/v1/saldo', require('./routes/saldoRoutes'));
app.use('/api/v1/salario', require('./routes/salarioRoutes'));
app.use('/api/v1/relatorios', require('./routes/relatorioRoutes'));

// =====================================================
// 404
// =====================================================
app.use((req, res) => {
  return erro(res, `Rota não encontrada: ${req.method} ${req.originalUrl}`, 404);
});

// =====================================================
// MIDDLEWARE DE ERROS
// =====================================================
app.use(errorMiddleware);

// =====================================================
// INICIA O SERVIDOR (após carregar o banco)
// =====================================================
(async () => {
  try {
    await db.initDatabase();

    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════');
      console.log('🚀 MoneyTrack API iniciada com sucesso!');
      console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Banco: SQLite`);
      console.log('═══════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
})();

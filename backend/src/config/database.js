/**
 * MoneyTrack - Configuração de Banco de Dados
 *
 * Estratégia dual:
 * - LOCAL (desenvolvimento): SQLite via sql.js (sem instalação)
 * - PRODUÇÃO (Railway): MySQL via mysql2
 *
 * Detecta automaticamente pelo DATABASE_URL ou NODE_ENV
 */

require('dotenv').config();

const isProducao = !!process.env.DATABASE_URL || process.env.NODE_ENV === 'production';

if (isProducao) {
  module.exports = require('./database.mysql');
} else {
  module.exports = require('./database.sqlite');
}

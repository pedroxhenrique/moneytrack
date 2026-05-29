/**
 * MoneyTrack - Configuração de Banco
 * Usa SQLite em todos os ambientes (local e produção)
 */

require('dotenv').config();

module.exports = require('./database.sqlite');
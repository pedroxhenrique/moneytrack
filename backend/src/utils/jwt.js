/**
 * Utilitário JWT - Gerar e validar tokens de autenticação
 */

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'moneytrack_chave_padrao';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Gera um token JWT com os dados do usuário
 * @param {Object} payload - Dados a serem incluídos no token (ex: { id, email })
 * @returns {string} Token JWT
 */
const gerarToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

/**
 * Valida e decodifica um token JWT
 * @param {string} token - Token JWT
 * @returns {Object} Payload decodificado
 * @throws Lança erro se o token for inválido ou expirado
 */
const validarToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  gerarToken,
  validarToken
};

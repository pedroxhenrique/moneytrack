/**
 * Middleware de Autenticação
 *
 * Valida o token JWT enviado no header Authorization.
 * Se válido, injeta req.usuarioId para uso nos controllers.
 *
 * Uso: aplicado em rotas que exigem autenticação
 */

const { validarToken } = require('../utils/jwt');
const { erro } = require('../utils/responseHelper');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return erro(res, 'Token de autenticação não fornecido', 401);
    }

    // Formato esperado: "Bearer <token>"
    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return erro(res, 'Formato do token inválido. Use: Bearer <token>', 401);
    }

    const token = partes[1];

    // Valida e decodifica o token
    const payload = validarToken(token);

    // Injeta dados do usuário na request
    req.usuarioId = payload.id;
    req.usuarioEmail = payload.email;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return erro(res, 'Token expirado, faça login novamente', 401);
    }
    return erro(res, 'Token inválido', 401);
  }
};

module.exports = authMiddleware;

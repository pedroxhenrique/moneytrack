/**
 * Middleware global de tratamento de erros
 * Captura qualquer erro não tratado e devolve resposta padronizada
 */

const { erro } = require('../utils/responseHelper');

const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Erro capturado:', {
    rota: req.originalUrl,
    metodo: req.method,
    mensagem: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Erro de JSON inválido
  if (err.type === 'entity.parse.failed') {
    return erro(res, 'Formato JSON inválido na requisição', 400);
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return erro(res, 'Token inválido', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return erro(res, 'Token expirado, faça login novamente', 401);
  }

  // Erros do SQLite
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return erro(res, 'Registro duplicado (valor único já existe)', 409);
  }

  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return erro(res, 'Operação viola integridade referencial', 409);
  }

  if (err.code === 'SQLITE_CONSTRAINT_CHECK') {
    return erro(res, 'Valor inválido para o campo', 400);
  }

  // Erro genérico
  const status = err.status || 500;
  const mensagem = status === 500
    ? 'Erro interno do servidor. Tente novamente mais tarde.'
    : err.message;

  return erro(res, mensagem, status);
};

module.exports = errorMiddleware;

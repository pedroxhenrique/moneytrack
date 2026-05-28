const transacaoService = require('../services/transacaoService');
const { sucesso } = require('../utils/responseHelper');

const obter = async (req, res, next) => {
  try { return sucesso(res, 'Saldo calculado', await transacaoService.calcularSaldo(req.usuarioId)); }
  catch (err) { next(err); }
};

module.exports = { obter };

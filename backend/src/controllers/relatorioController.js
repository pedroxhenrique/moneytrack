const transacaoService = require('../services/transacaoService');
const { sucesso } = require('../utils/responseHelper');

const gastosPorCategoria = async (req, res, next) => {
  try {
    const relatorio = await transacaoService.gerarRelatorioGastos(req.usuarioId, req.query.dataInicio, req.query.dataFim);
    return sucesso(res, 'Relatório gerado', relatorio);
  } catch (err) { next(err); }
};

module.exports = { gastosPorCategoria };

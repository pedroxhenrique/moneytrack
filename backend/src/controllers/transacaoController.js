const transacaoService = require('../services/transacaoService');
const { sucesso } = require('../utils/responseHelper');

const listar = async (req, res, next) => {
  try {
    const filtros = { dataInicio: req.query.dataInicio, dataFim: req.query.dataFim, categoriaId: req.query.categoriaId };
    const transacoes = await transacaoService.listar(req.usuarioId, filtros);
    return sucesso(res, 'Transações listadas', { transacoes, filtros });
  } catch (err) { next(err); }
};

const criar = async (req, res, next) => {
  try {
    const transacao = await transacaoService.criar(req.body, req.usuarioId);
    const saldoAtualizado = await transacaoService.calcularSaldo(req.usuarioId);
    return sucesso(res, 'Transação cadastrada', { transacao, saldoAtualizado }, 201);
  } catch (err) { next(err); }
};

const atualizar = async (req, res, next) => {
  try {
    const transacao = await transacaoService.atualizar(req.params.id, req.body, req.usuarioId);
    const saldoAtualizado = await transacaoService.calcularSaldo(req.usuarioId);
    return sucesso(res, 'Transação atualizada', { transacao, saldoAtualizado });
  } catch (err) { next(err); }
};

const excluir = async (req, res, next) => {
  try {
    await transacaoService.excluir(req.params.id, req.usuarioId);
    const saldoAtualizado = await transacaoService.calcularSaldo(req.usuarioId);
    return sucesso(res, 'Transação excluída', { saldoAtualizado });
  } catch (err) { next(err); }
};

module.exports = { listar, criar, atualizar, excluir };

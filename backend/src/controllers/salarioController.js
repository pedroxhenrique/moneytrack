const salarioModel = require('../models/salarioModel');
const { sucesso, erro } = require('../utils/responseHelper');

const obterConfig = async (req, res, next) => {
  try {
    const config = await salarioModel.buscarConfig(req.usuarioId);
    const saldo = await salarioModel.calcularSaldoSalarial(req.usuarioId);
    return sucesso(res, 'Configuração salarial obtida', { config, saldo });
  } catch (err) { next(err); }
};

const salvarConfig = async (req, res, next) => {
  try {
    const { salarioBase, renovacaoAutomatica, diaRenovacao, alertaPercentual } = req.body;
    if (!salarioBase || salarioBase <= 0) {
      return erro(res, 'Salário base deve ser maior que zero', 400);
    }
    await salarioModel.salvarConfig(req.usuarioId, {
      salarioBase, renovacaoAutomatica, diaRenovacao, alertaPercentual
    });
    const saldo = await salarioModel.calcularSaldoSalarial(req.usuarioId);
    return sucesso(res, 'Configuração salarial salva!', { saldo });
  } catch (err) { next(err); }
};

const obterSaldo = async (req, res, next) => {
  try {
    const saldo = await salarioModel.calcularSaldoSalarial(req.usuarioId);
    return sucesso(res, 'Saldo salarial calculado', saldo);
  } catch (err) { next(err); }
};

const obterGastosPorCategoria = async (req, res, next) => {
  try {
    const { mes, ano } = req.query;
    const gastos = await salarioModel.gastosPorCategoria(req.usuarioId, mes, ano);
    return sucesso(res, 'Gastos por categoria', { gastos });
  } catch (err) { next(err); }
};

const obterHistorico = async (req, res, next) => {
  try {
    const hist = await salarioModel.historico(req.usuarioId);
    return sucesso(res, 'Histórico salarial', { historico: hist });
  } catch (err) { next(err); }
};

const resetarSaldo = async (req, res, next) => {
  try {
    await salarioModel.resetarSaldo(req.usuarioId);
    const saldo = await salarioModel.calcularSaldoSalarial(req.usuarioId);
    return sucesso(res, 'Saldo salarial resetado!', { saldo });
  } catch (err) { next(err); }
};

module.exports = { obterConfig, salvarConfig, obterSaldo, obterGastosPorCategoria, obterHistorico, resetarSaldo };
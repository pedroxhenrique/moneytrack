const transacaoModel = require('../models/transacaoModel');
const categoriaModel = require('../models/categoriaModel');

const listar = async (usuarioId, filtros) => transacaoModel.listar(usuarioId, filtros);

const buscarPorId = async (id, usuarioId) => {
  const t = await transacaoModel.buscarPorId(id, usuarioId);
  if (!t) { const erro = new Error('Transação não encontrada'); erro.status = 404; throw erro; }
  return t;
};

const criar = async (dados, usuarioId) => {
  const categoria = await categoriaModel.buscarPorId(dados.categoriaId, usuarioId);
  if (!categoria) {
    const erro = new Error('Categoria não encontrada ou não pertence ao usuário'); erro.status = 400; throw erro;
  }
  const id = await transacaoModel.criar({ ...dados, usuarioId });
  return transacaoModel.buscarPorId(id, usuarioId);
};

const atualizar = async (id, dados, usuarioId) => {
  const t = await transacaoModel.buscarPorId(id, usuarioId);
  if (!t) { const erro = new Error('Transação não encontrada'); erro.status = 404; throw erro; }
  const categoria = await categoriaModel.buscarPorId(dados.categoriaId, usuarioId);
  if (!categoria) {
    const erro = new Error('Categoria inválida'); erro.status = 400; throw erro;
  }
  await transacaoModel.atualizar(id, dados, usuarioId);
  return transacaoModel.buscarPorId(id, usuarioId);
};

const excluir = async (id, usuarioId) => {
  const t = await transacaoModel.buscarPorId(id, usuarioId);
  if (!t) { const erro = new Error('Transação não encontrada'); erro.status = 404; throw erro; }
  await transacaoModel.excluir(id, usuarioId);
};

const calcularSaldo = async (usuarioId) => transacaoModel.calcularSaldo(usuarioId);

const gerarRelatorioGastos = async (usuarioId, dataInicio, dataFim) => {
  const categorias = await transacaoModel.relatorioGastosPorCategoria(usuarioId, dataInicio, dataFim);
  const totalGeral = categorias.reduce((acc, c) => acc + parseFloat(c.total), 0);
  return {
    periodo: { dataInicio: dataInicio || null, dataFim: dataFim || null },
    totalGeral,
    categorias: categorias.map(c => ({
      ...c,
      total: parseFloat(c.total),
      percentual: totalGeral > 0 ? Number(((parseFloat(c.total) / totalGeral) * 100).toFixed(2)) : 0
    }))
  };
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir, calcularSaldo, gerarRelatorioGastos };

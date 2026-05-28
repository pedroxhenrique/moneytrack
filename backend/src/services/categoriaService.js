const categoriaModel = require('../models/categoriaModel');

const listar = async (usuarioId) => categoriaModel.listarPorUsuario(usuarioId);

const criar = async (dados, usuarioId) => {
  const existente = await categoriaModel.buscarPorNome(dados.nome, usuarioId);
  if (existente) {
    const erro = new Error('Já existe uma categoria com este nome'); erro.status = 409; throw erro;
  }
  const id = await categoriaModel.criar({ nome: dados.nome, usuarioId });
  return categoriaModel.buscarPorId(id, usuarioId);
};

const atualizar = async (id, dados, usuarioId) => {
  const categoria = await categoriaModel.buscarPorId(id, usuarioId);
  if (!categoria) {
    const erro = new Error('Categoria não encontrada'); erro.status = 404; throw erro;
  }
  const duplicada = await categoriaModel.buscarPorNome(dados.nome, usuarioId);
  if (duplicada && duplicada.id !== Number(id)) {
    const erro = new Error('Já existe uma categoria com este nome'); erro.status = 409; throw erro;
  }
  await categoriaModel.atualizar(id, dados.nome, usuarioId);
  return categoriaModel.buscarPorId(id, usuarioId);
};

const excluir = async (id, usuarioId) => {
  const categoria = await categoriaModel.buscarPorId(id, usuarioId);
  if (!categoria) {
    const erro = new Error('Categoria não encontrada'); erro.status = 404; throw erro;
  }
  const total = await categoriaModel.contarTransacoes(id);
  if (total > 0) {
    const erro = new Error(`Não é possível excluir: existem ${total} transação(ões) vinculada(s)`);
    erro.status = 409; throw erro;
  }
  await categoriaModel.excluir(id, usuarioId);
};

module.exports = { listar, criar, atualizar, excluir };

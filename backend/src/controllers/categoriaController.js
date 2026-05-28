const categoriaService = require('../services/categoriaService');
const { sucesso } = require('../utils/responseHelper');

const listar = async (req, res, next) => {
  try { return sucesso(res, 'Categorias listadas', { categorias: await categoriaService.listar(req.usuarioId) }); }
  catch (err) { next(err); }
};

const criar = async (req, res, next) => {
  try { return sucesso(res, 'Categoria criada', { categoria: await categoriaService.criar(req.body, req.usuarioId) }, 201); }
  catch (err) { next(err); }
};

const atualizar = async (req, res, next) => {
  try { return sucesso(res, 'Categoria atualizada', { categoria: await categoriaService.atualizar(req.params.id, req.body, req.usuarioId) }); }
  catch (err) { next(err); }
};

const excluir = async (req, res, next) => {
  try { await categoriaService.excluir(req.params.id, req.usuarioId); return sucesso(res, 'Categoria excluída'); }
  catch (err) { next(err); }
};

module.exports = { listar, criar, atualizar, excluir };

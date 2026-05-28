const db = require('../config/database');

const listarPorUsuario = async (usuarioId) =>
  db.all('SELECT * FROM categorias WHERE usuario_id = ? ORDER BY nome ASC', [usuarioId]);

const buscarPorId = async (id, usuarioId) =>
  db.get('SELECT * FROM categorias WHERE id = ? AND usuario_id = ?', [id, usuarioId]);

const buscarPorNome = async (nome, usuarioId) =>
  db.get('SELECT * FROM categorias WHERE LOWER(nome) = LOWER(?) AND usuario_id = ?', [nome, usuarioId]);

const criar = async (dados) =>
  db.insert('INSERT INTO categorias (nome, usuario_id) VALUES (?, ?)', [dados.nome, dados.usuarioId]);

const atualizar = async (id, nome, usuarioId) =>
  db.run('UPDATE categorias SET nome = ? WHERE id = ? AND usuario_id = ?', [nome, id, usuarioId]);

const excluir = async (id, usuarioId) =>
  db.run('DELETE FROM categorias WHERE id = ? AND usuario_id = ?', [id, usuarioId]);

const contarTransacoes = async (categoriaId) => {
  const r = await db.get('SELECT COUNT(*) as total FROM transacoes WHERE categoria_id = ?', [categoriaId]);
  return r ? Number(r.total) : 0;
};

module.exports = { listarPorUsuario, buscarPorId, buscarPorNome, criar, atualizar, excluir, contarTransacoes };

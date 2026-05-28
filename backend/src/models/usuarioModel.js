const db = require('../config/database');

const buscarPorEmail = async (email) =>
  db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

const buscarPorId = async (id) =>
  db.get('SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?', [id]);

const criar = async (dados) =>
  db.insert('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [dados.nome, dados.email, dados.senha]);

const criarCategoriasPadrao = async (usuarioId) => {
  const categorias = ['Alimentação','Transporte','Lazer','Salário','Moradia','Saúde','Outros'];
  for (const nome of categorias) {
    await db.run('INSERT INTO categorias (nome, usuario_id) VALUES (?, ?)', [nome, usuarioId]);
  }
};

module.exports = { buscarPorEmail, buscarPorId, criar, criarCategoriasPadrao };

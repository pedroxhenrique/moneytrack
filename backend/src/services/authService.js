const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');
const { gerarToken } = require('../utils/jwt');

const cadastrar = async (dados) => {
  const { nome, email, senha } = dados;
  const emailExistente = await usuarioModel.buscarPorEmail(email);
  if (emailExistente) {
    const erro = new Error('Este e-mail já está cadastrado'); erro.status = 409; throw erro;
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  const usuarioId = await usuarioModel.criar({ nome, email, senha: senhaHash });
  await usuarioModel.criarCategoriasPadrao(usuarioId);
  const usuario = await usuarioModel.buscarPorId(usuarioId);
  const token = gerarToken({ id: usuario.id, email: usuario.email });
  return { usuario, token };
};

const login = async (dados) => {
  const { email, senha } = dados;
  const usuario = await usuarioModel.buscarPorEmail(email);
  if (!usuario) {
    const erro = new Error('E-mail ou senha inválidos'); erro.status = 401; throw erro;
  }
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    const erro = new Error('E-mail ou senha inválidos'); erro.status = 401; throw erro;
  }
  const token = gerarToken({ id: usuario.id, email: usuario.email });
  return {
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, criado_em: usuario.criado_em },
    token
  };
};

const obterPerfil = async (usuarioId) => {
  const usuario = await usuarioModel.buscarPorId(usuarioId);
  if (!usuario) {
    const erro = new Error('Usuário não encontrado'); erro.status = 404; throw erro;
  }
  return usuario;
};

module.exports = { cadastrar, login, obterPerfil };

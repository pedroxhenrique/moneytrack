const authService = require('../services/authService');
const { sucesso } = require('../utils/responseHelper');

const cadastrar = async (req, res, next) => {
  try {
    const resultado = await authService.cadastrar(req.body);
    return sucesso(res, 'Cadastro realizado com sucesso', resultado, 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const resultado = await authService.login(req.body);
    return sucesso(res, 'Login realizado com sucesso', resultado);
  } catch (err) { next(err); }
};

const perfil = async (req, res, next) => {
  try {
    const usuario = await authService.obterPerfil(req.usuarioId);
    return sucesso(res, 'Perfil obtido com sucesso', { usuario });
  } catch (err) { next(err); }
};

module.exports = { cadastrar, login, perfil };

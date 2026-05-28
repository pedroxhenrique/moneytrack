/**
 * Validadores de Campos
 *
 * Define as regras de validação para os endpoints da API.
 * Utiliza express-validator.
 *
 * As mensagens de erro são em português para boa UX.
 */

const { body, validationResult } = require('express-validator');
const { erro } = require('../utils/responseHelper');

/**
 * Middleware que processa o resultado das validações.
 * Se houver erros, retorna 400 com a lista de erros.
 */
const validar = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    const listaErros = erros.array().map(e => ({
      campo: e.path,
      mensagem: e.msg
    }));
    return erro(res, 'Dados inválidos', 400, listaErros);
  }
  next();
};

// =====================================================
// VALIDAÇÕES DE AUTENTICAÇÃO
// =====================================================

/**
 * Validação para cadastro de usuário
 * Regras:
 * - Nome: obrigatório, 2-100 caracteres
 * - E-mail: obrigatório, formato válido
 * - Senha: mínimo 6 caracteres (RN01)
 */
const validarCadastro = [
  body('nome')
    .trim()
    .notEmpty().withMessage('O nome é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('O nome deve ter entre 2 e 100 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),

  body('senha')
    .notEmpty().withMessage('A senha é obrigatória')
    .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),

  validar
];

/**
 * Validação para login
 */
const validarLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),

  body('senha')
    .notEmpty().withMessage('A senha é obrigatória'),

  validar
];

// =====================================================
// VALIDAÇÕES DE TRANSAÇÃO
// =====================================================

/**
 * Validação de transação (criar/atualizar)
 * Regras RN05, RN06
 */
const validarTransacao = [
  body('tipo')
    .notEmpty().withMessage('O tipo é obrigatório')
    .isIn(['entrada', 'saida']).withMessage('Tipo deve ser "entrada" ou "saida"'),

  body('valor')
    .notEmpty().withMessage('O valor é obrigatório')
    .isFloat({ min: 0.01 }).withMessage('O valor deve ser maior que zero (mínimo R$ 0,01)'),

  body('categoriaId')
    .notEmpty().withMessage('A categoria é obrigatória')
    .isInt({ min: 1 }).withMessage('Categoria inválida'),

  body('data')
    .notEmpty().withMessage('A data é obrigatória')
    .isISO8601().withMessage('Data inválida. Use o formato YYYY-MM-DD'),

  body('descricao')
    .optional()
    .isLength({ max: 255 }).withMessage('A descrição deve ter no máximo 255 caracteres'),

  validar
];

module.exports = {
  validar,
  validarCadastro,
  validarLogin,
  validarTransacao
};

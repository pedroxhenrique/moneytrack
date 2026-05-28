/**
 * Rotas de Categorias
 * Base: /api/v1/categorias
 * Todas as rotas exigem autenticação
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validar } = require('../middlewares/validators');

// Validação do nome da categoria
const validarCategoria = [
  body('nome')
    .trim()
    .notEmpty().withMessage('O nome da categoria é obrigatório')
    .isLength({ min: 2, max: 100 }).withMessage('O nome deve ter entre 2 e 100 caracteres'),
  validar
];

// Todas as rotas exigem autenticação
router.use(authMiddleware);

router.get('/', categoriaController.listar);
router.post('/', validarCategoria, categoriaController.criar);
router.put('/:id', validarCategoria, categoriaController.atualizar);
router.delete('/:id', categoriaController.excluir);

module.exports = router;

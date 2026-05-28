/**
 * Rotas de Autenticação
 * Base: /api/v1/auth
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validarCadastro, validarLogin } = require('../middlewares/validators');

/**
 * POST /api/v1/auth/cadastro
 * Cria um novo usuário no sistema
 * Body: { nome, email, senha }
 */
router.post('/cadastro', validarCadastro, authController.cadastrar);

/**
 * POST /api/v1/auth/login
 * Autentica um usuário e retorna token JWT
 * Body: { email, senha }
 */
router.post('/login', validarLogin, authController.login);

/**
 * GET /api/v1/auth/perfil
 * Retorna dados do usuário autenticado
 * Header: Authorization: Bearer <token>
 */
router.get('/perfil', authMiddleware, authController.perfil);

module.exports = router;

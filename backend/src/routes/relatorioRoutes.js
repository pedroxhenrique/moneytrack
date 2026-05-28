/**
 * Rotas de Relatórios
 * Base: /api/v1/relatorios
 */

const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/gastos', relatorioController.gastosPorCategoria);

module.exports = router;

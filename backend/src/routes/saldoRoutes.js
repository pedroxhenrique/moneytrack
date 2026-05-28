/**
 * Rotas de Saldo
 * Base: /api/v1/saldo
 */

const express = require('express');
const router = express.Router();

const saldoController = require('../controllers/saldoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/', saldoController.obter);

module.exports = router;

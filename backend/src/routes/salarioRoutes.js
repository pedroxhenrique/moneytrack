const express = require('express');
const router = express.Router();
const salarioController = require('../controllers/salarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/config', salarioController.obterConfig);
router.post('/config', salarioController.salvarConfig);
router.get('/saldo', salarioController.obterSaldo);
router.get('/categorias', salarioController.obterGastosPorCategoria);
router.get('/historico', salarioController.obterHistorico);
router.post('/resetar', salarioController.resetarSaldo);

module.exports = router;
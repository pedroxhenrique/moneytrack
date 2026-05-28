const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validarTransacao } = require('../middlewares/validators');

router.use(authMiddleware);

router.get('/',     transacaoController.listar);
router.post('/',    validarTransacao, transacaoController.criar);
router.put('/:id',  validarTransacao, transacaoController.atualizar);
router.delete('/:id', transacaoController.excluir);

module.exports = router;

/**
 * Helper para padronizar respostas da API
 * Garante que todas as respostas sigam o mesmo formato
 */

/**
 * Resposta de sucesso
 * @param {Response} res - Objeto response do Express
 * @param {string} mensagem - Mensagem descritiva
 * @param {*} dados - Dados a serem retornados (opcional)
 * @param {number} status - Código HTTP (padrão: 200)
 */
const sucesso = (res, mensagem, dados = null, status = 200) => {
  const resposta = {
    sucesso: true,
    mensagem
  };

  if (dados !== null) {
    resposta.dados = dados;
  }

  return res.status(status).json(resposta);
};

/**
 * Resposta de erro
 * @param {Response} res - Objeto response do Express
 * @param {string} mensagem - Mensagem do erro
 * @param {number} status - Código HTTP (padrão: 400)
 * @param {Array} erros - Lista de erros detalhados (opcional)
 */
const erro = (res, mensagem, status = 400, erros = null) => {
  const resposta = {
    sucesso: false,
    mensagem
  };

  if (erros !== null) {
    resposta.erros = erros;
  }

  return res.status(status).json(resposta);
};

module.exports = {
  sucesso,
  erro
};

const db = require('../config/database');

const listar = async (usuarioId, filtros = {}) => {
  let sql = `
    SELECT t.id, t.tipo, t.valor, t.descricao, t.data,
           t.categoria_id, t.criado_em, t.impactar_salario,
           c.nome as categoria_nome
    FROM transacoes t
    INNER JOIN categorias c ON c.id = t.categoria_id
    WHERE t.usuario_id = ?`;
  const params = [usuarioId];

  if (filtros.dataInicio) { sql += ' AND t.data >= ?'; params.push(filtros.dataInicio); }
  if (filtros.dataFim)    { sql += ' AND t.data <= ?'; params.push(filtros.dataFim); }
  if (filtros.categoriaId){ sql += ' AND t.categoria_id = ?'; params.push(filtros.categoriaId); }

  sql += ' ORDER BY t.data DESC, t.id DESC';
  return db.all(sql, params);
};

const buscarPorId = async (id, usuarioId) =>
  db.get(`SELECT t.*, c.nome as categoria_nome
          FROM transacoes t INNER JOIN categorias c ON c.id = t.categoria_id
          WHERE t.id = ? AND t.usuario_id = ?`, [id, usuarioId]);

const criar = async (dados) =>
  db.insert(
    `INSERT INTO transacoes (tipo, valor, descricao, data, categoria_id, usuario_id, impactar_salario)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [dados.tipo, dados.valor, dados.descricao || '', dados.data,
     dados.categoriaId, dados.usuarioId, dados.impactarSalario ? 1 : 0]
  );

const atualizar = async (id, dados, usuarioId) =>
  db.run(
    `UPDATE transacoes SET tipo=?, valor=?, descricao=?, data=?, categoria_id=?, impactar_salario=?
     WHERE id=? AND usuario_id=?`,
    [dados.tipo, dados.valor, dados.descricao || '', dados.data,
     dados.categoriaId, dados.impactarSalario ? 1 : 0, id, usuarioId]
  );

const excluir = async (id, usuarioId) =>
  db.run('DELETE FROM transacoes WHERE id = ? AND usuario_id = ?', [id, usuarioId]);

const calcularSaldo = async (usuarioId) => {
  const r = await db.get(
    `SELECT
       COALESCE(SUM(CASE WHEN tipo='entrada' THEN valor ELSE 0 END), 0) as totalEntradas,
       COALESCE(SUM(CASE WHEN tipo='saida'   THEN valor ELSE 0 END), 0) as totalSaidas
     FROM transacoes WHERE usuario_id = ?`, [usuarioId]);
  const entradas = parseFloat(r?.totalEntradas || 0);
  const saidas   = parseFloat(r?.totalSaidas   || 0);
  return { saldo: entradas - saidas, totalEntradas: entradas, totalSaidas: saidas };
};

const relatorioGastosPorCategoria = async (usuarioId, dataInicio, dataFim) => {
  let sql = `
    SELECT c.id as categoriaId, c.nome as categoriaNome,
           COALESCE(SUM(t.valor), 0) as total,
           COUNT(t.id) as quantidade
    FROM categorias c
    LEFT JOIN transacoes t ON t.categoria_id = c.id
      AND t.tipo = 'saida' AND t.usuario_id = ?`;
  const params = [usuarioId];
  if (dataInicio) { sql += ' AND t.data >= ?'; params.push(dataInicio); }
  if (dataFim)    { sql += ' AND t.data <= ?'; params.push(dataFim); }
  sql += ` WHERE c.usuario_id = ?
           GROUP BY c.id, c.nome
           HAVING total > 0
           ORDER BY total DESC`;
  params.push(usuarioId);
  return db.all(sql, params);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir, calcularSaldo, relatorioGastosPorCategoria };
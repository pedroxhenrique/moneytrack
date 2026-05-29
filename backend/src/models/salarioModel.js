const db = require('../config/database');

const buscarConfig = async (usuarioId) =>
  db.get('SELECT * FROM salario_config WHERE usuario_id = ?', [usuarioId]);

const salvarConfig = async (usuarioId, dados) => {
  const existente = await buscarConfig(usuarioId);
  if (existente) {
    await db.run(
      `UPDATE salario_config SET
        salario_base = ?, renovacao_automatica = ?, dia_renovacao = ?,
        alerta_percentual = ?, atualizado_em = CURRENT_TIMESTAMP
       WHERE usuario_id = ?`,
      [dados.salarioBase, dados.renovacaoAutomatica ? 1 : 0,
       dados.diaRenovacao || 1, dados.alertaPercentual || 80, usuarioId]
    );
  } else {
    await db.insert(
      `INSERT INTO salario_config
        (usuario_id, salario_base, renovacao_automatica, dia_renovacao, alerta_percentual)
       VALUES (?, ?, ?, ?, ?)`,
      [usuarioId, dados.salarioBase, dados.renovacaoAutomatica ? 1 : 0,
       dados.diaRenovacao || 1, dados.alertaPercentual || 80]
    );
  }
};

const calcularSaldoSalarial = async (usuarioId) => {
  const config = await buscarConfig(usuarioId);
  if (!config) return { salarioBase: 0, totalEntradas: 0, totalSaidas: 0, saldoAtual: 0, percentualGasto: 0 };

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  const transacoes = await db.all(
    `SELECT tipo, valor FROM transacoes
     WHERE usuario_id = ? AND impactar_salario = 1
       AND strftime('%m', data) = ? AND strftime('%Y', data) = ?`,
    [usuarioId, String(mesAtual).padStart(2, '0'), String(anoAtual)]
  );

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((s, t) => s + parseFloat(t.valor), 0);
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((s, t) => s + parseFloat(t.valor), 0);
  const salarioBase = parseFloat(config.salario_base);
  const saldoAtual = salarioBase + totalEntradas - totalSaidas;
  const percentualGasto = salarioBase > 0 ? Math.min(((totalSaidas / salarioBase) * 100), 100) : 0;

  return {
    salarioBase, totalEntradas, totalSaidas, saldoAtual,
    percentualGasto: parseFloat(percentualGasto.toFixed(2)),
    alertaPercentual: parseFloat(config.alerta_percentual),
    renovacaoAutomatica: config.renovacao_automatica === 1,
    diaRenovacao: config.dia_renovacao,
    emAlerta: percentualGasto >= parseFloat(config.alerta_percentual)
  };
};

const gastosPorCategoria = async (usuarioId, mes, ano) => {
  const m = mes || new Date().getMonth() + 1;
  const a = ano || new Date().getFullYear();
  return db.all(
    `SELECT c.nome as categoria, SUM(t.valor) as total, COUNT(t.id) as quantidade
     FROM transacoes t
     INNER JOIN categorias c ON c.id = t.categoria_id
     WHERE t.usuario_id = ? AND t.impactar_salario = 1 AND t.tipo = 'saida'
       AND strftime('%m', t.data) = ? AND strftime('%Y', t.data) = ?
     GROUP BY t.categoria_id, c.nome ORDER BY total DESC`,
    [usuarioId, String(m).padStart(2, '0'), String(a)]
  );
};

const historico = async (usuarioId) => {
  return db.all(
    `SELECT strftime('%m', data) as mes, strftime('%Y', data) as ano,
       SUM(CASE WHEN tipo='entrada' THEN valor ELSE 0 END) as entradas,
       SUM(CASE WHEN tipo='saida' THEN valor ELSE 0 END) as saidas,
       COUNT(*) as total_lancamentos
     FROM transacoes
     WHERE usuario_id = ? AND impactar_salario = 1
     GROUP BY strftime('%Y-%m', data)
     ORDER BY ano DESC, mes DESC LIMIT 12`,
    [usuarioId]
  );
};

const resetarSaldo = async (usuarioId) => {
  await buscarConfig(usuarioId);
};

module.exports = { buscarConfig, salvarConfig, calcularSaldoSalarial, gastosPorCategoria, historico, resetarSaldo };
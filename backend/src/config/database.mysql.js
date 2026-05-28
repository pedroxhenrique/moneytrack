/**
 * MoneyTrack - Banco MySQL (Produção - Railway)
 * Pool de conexões com mysql2/promise
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

async function initDatabase() {
  if (pool) return pool;

  // Railway fornece DATABASE_URL ou variáveis separadas
  const config = process.env.DATABASE_URL
    ? { uri: process.env.DATABASE_URL }
    : {
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
        user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'moneytrack',
      };

  pool = process.env.DATABASE_URL
    ? mysql.createPool({ uri: process.env.DATABASE_URL, waitForConnections: true, connectionLimit: 10, timezone: '-03:00' })
    : mysql.createPool({ ...config, waitForConnections: true, connectionLimit: 10, timezone: '-03:00' });

  // Testa conexão e cria tabelas
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL conectado!');
    conn.release();
    await criarTabelas();
  } catch (err) {
    console.error('❌ Erro MySQL:', err.message);
    throw err;
  }

  return pool;
}

async function criarTabelas() {
  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        usuario_id INT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_cat_usuario (usuario_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS transacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo ENUM('entrada','saida') NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        descricao VARCHAR(255),
        data DATE NOT NULL,
        categoria_id INT NOT NULL,
        usuario_id INT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_trans_usuario (usuario_id),
        INDEX idx_trans_data (data)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Tabelas MySQL criadas/verificadas!');
  } finally {
    conn.release();
  }
}

async function run(sql, params = []) {
  if (!pool) throw new Error('Banco não inicializado');
  await pool.execute(sql, params);
}

async function get(sql, params = []) {
  if (!pool) throw new Error('Banco não inicializado');
  const [rows] = await pool.execute(sql, params);
  return rows[0] || null;
}

async function all(sql, params = []) {
  if (!pool) throw new Error('Banco não inicializado');
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function insert(sql, params = []) {
  if (!pool) throw new Error('Banco não inicializado');
  const [result] = await pool.execute(sql, params);
  return result.insertId;
}

async function exec(sql) {
  if (!pool) throw new Error('Banco não inicializado');
  await pool.query(sql);
}

module.exports = { initDatabase, run, get, all, insert, exec };

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/moneytrack.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

let db = null;

async function initDatabase() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
    console.log('✅ SQLite carregado:', dbPath);
  } else {
    db = new SQL.Database();
    console.log('✅ SQLite criado:', dbPath);
  }
  db.run('PRAGMA foreign_keys = ON');
  await criarTabelas();
  return db;
}

async function criarTabelas() {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL CHECK(tipo IN ('entrada','saida')),
    valor REAL NOT NULL CHECK(valor > 0),
    descricao TEXT,
    data DATE NOT NULL,
    categoria_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    impactar_salario INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )`);

  try {
    db.run(`ALTER TABLE transacoes ADD COLUMN impactar_salario INTEGER DEFAULT 0`);
  } catch(e) { /* coluna já existe */ }

  db.run(`CREATE TABLE IF NOT EXISTS salario_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL UNIQUE,
    salario_base REAL NOT NULL DEFAULT 0,
    renovacao_automatica INTEGER DEFAULT 0,
    dia_renovacao INTEGER DEFAULT 1,
    alerta_percentual REAL DEFAULT 80,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS salario_historico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    salario_base REAL NOT NULL,
    total_impactado REAL DEFAULT 0,
    saldo_final REAL DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )`);

  salvarBanco();
  console.log('✅ Tabelas criadas/verificadas!');
}

function salvarBanco() {
  if (!db) return;
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
}

function run(sql, params = []) {
  if (!db) throw new Error('Banco não inicializado');
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  salvarBanco();
}

function get(sql, params = []) {
  if (!db) throw new Error('Banco não inicializado');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

function all(sql, params = []) {
  if (!db) throw new Error('Banco não inicializado');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function insert(sql, params = []) {
  if (!db) throw new Error('Banco não inicializado');
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  const r = db.exec('SELECT last_insert_rowid() as id');
  const id = r[0]?.values[0]?.[0];
  salvarBanco();
  return id;
}

function exec(sql) {
  if (!db) throw new Error('Banco não inicializado');
  db.run(sql);
  salvarBanco();
}

module.exports = { initDatabase, run, get, all, insert, exec, salvarBanco };
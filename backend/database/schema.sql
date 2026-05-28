-- =====================================================
-- MoneyTrack - Script de Criação do Banco de Dados
-- Autor: Pedro Henrique da Silva Santos
-- Banco: SQLite 3
-- =====================================================
-- IMPORTANTE: Mantém-se a estrutura idêntica ao DER
-- documentado (3 tabelas, FKs, integridade referencial),
-- compatível com migração para MySQL.
-- =====================================================

-- Habilitar chaves estrangeiras
PRAGMA foreign_keys = ON;

-- =====================================================
-- Tabela: usuarios
-- Armazena os dados de cadastro dos usuários do sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Tabela: categorias
-- Categorias personalizadas para classificar transações
-- Relacionamento 1:N com usuários
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  usuario_id INTEGER NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índice para melhorar consultas por usuário
CREATE INDEX IF NOT EXISTS idx_categoria_usuario ON categorias(usuario_id);

-- =====================================================
-- Tabela: transacoes
-- Registros financeiros (entradas e saídas) do usuário
-- Relacionamento N:1 com categorias e usuários
-- =====================================================
CREATE TABLE IF NOT EXISTS transacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL CHECK(tipo IN ('entrada', 'saida')),
  valor REAL NOT NULL CHECK(valor > 0),
  descricao TEXT,
  data DATE NOT NULL,
  categoria_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_transacao_usuario ON transacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacao_data ON transacoes(data);
CREATE INDEX IF NOT EXISTS idx_transacao_categoria ON transacoes(categoria_id);

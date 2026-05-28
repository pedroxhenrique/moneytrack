const fs = require('fs');
const path = require('path');
const db = require('./database');

console.log('\n═══════════════════════════════════════');
console.log('🔨 Inicializando banco MoneyTrack...');
console.log('═══════════════════════════════════════');

(async () => {
  try {
    await db.initDatabase();

    // Se for SQLite, executa o schema.sql
    if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
      const schemaPath = path.join(__dirname, '../../database/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema);
      }
    }

    console.log('\n✅ Banco inicializado com sucesso!');
    console.log('   Agora rode: npm run dev\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
})();

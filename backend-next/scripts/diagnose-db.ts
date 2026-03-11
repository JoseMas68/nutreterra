import { PrismaClient } from '@prisma/client';

// Test con DATABASE_URL (pooler)
const prismaPooler = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Test con DIRECT_URL
const prismaDirect = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function testConnection() {
  console.log('Probando conexión a la base de datos...\n');

  console.log('1. Probando con DATABASE_URL (Transaction Pooler):');
  console.log('   URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  try {
    await prismaPooler.$connect();
    console.log('   ✅ Conexión exitosa con pooler');

    const result = await prismaPooler.$queryRaw`SELECT NOW()`;
    console.log('   ✅ Query exitosa:', result);
  } catch (error: any) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n2. Probando con DIRECT_URL (Direct Connection):');
  console.log('   URL:', process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':****@'));

  try {
    await prismaDirect.$connect();
    console.log('   ✅ Conexión exitosa con directa');

    const result = await prismaDirect.$queryRaw`SELECT NOW()`;
    console.log('   ✅ Query exitosa:', result);

    // Verificar si existe la tabla users
    console.log('\n3. Verificando tablas:');
    const tables = await prismaDirect.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `;
    console.log('   Tablas encontradas:', tables);

    // Verificar usuarios
    console.log('\n4. Verificando usuarios:');
    const users = await prismaDirect.$queryRaw`SELECT id, email, role, name FROM users`;
    console.log('   Usuarios:', users);
  } catch (error: any) {
    console.log('   ❌ Error:', error.message);
  } finally {
    await prismaPooler.$disconnect();
    await prismaDirect.$disconnect();
  }
}

testConnection();

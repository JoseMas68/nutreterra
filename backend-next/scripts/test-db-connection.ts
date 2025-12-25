/**
 * Script para verificar la conexión con Supabase
 * Ejecutar con: npx tsx scripts/test-db-connection.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...\n');

  try {
    // Test 1: Conectar a la base de datos
    console.log('1️⃣ Intentando conectar...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Test 2: Verificar si existen tablas
    console.log('2️⃣ Verificando tablas...');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    if (tables.length === 0) {
      console.log('⚠️  No hay tablas creadas aún');
      console.log('   Ejecuta: npm run prisma:migrate\n');
    } else {
      console.log(`✅ Encontradas ${tables.length} tablas:`);
      tables.forEach((table) => {
        console.log(`   - ${table.tablename}`);
      });
      console.log('');
    }

    // Test 3: Contar registros (si existen tablas)
    if (tables.some((t) => t.tablename === 'products')) {
      console.log('3️⃣ Contando registros...');
      const productCount = await prisma.product.count();
      const categoryCount = await prisma.category.count();
      const userCount = await prisma.user.count();

      console.log(`   - Productos: ${productCount}`);
      console.log(`   - Categorías: ${categoryCount}`);
      console.log(`   - Usuarios: ${userCount}`);

      if (productCount === 0) {
        console.log('\n⚠️  No hay datos. Ejecuta: npm run prisma:seed');
      } else {
        console.log('\n✅ Base de datos lista con datos');
      }
    }

    console.log('\n🎉 Todo funciona correctamente!');
    console.log('\n📊 Puedes abrir Prisma Studio con: npm run prisma:studio');
  } catch (error) {
    console.error('\n❌ Error al conectar con la base de datos:\n');
    if (error instanceof Error) {
      console.error(error.message);
      console.error('\n💡 Posibles soluciones:');
      console.error('   1. Verifica que DATABASE_URL esté configurado en .env');
      console.error('   2. Asegúrate de haber reemplazado [YOUR-PASSWORD]');
      console.error('   3. Verifica que tu proyecto de Supabase esté activo');
      console.error('   4. Comprueba tu conexión a internet');
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

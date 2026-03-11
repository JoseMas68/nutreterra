import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function resetDatabase() {
  try {
    console.log('🔄 Iniciando limpieza de base de datos...\n');

    // 1. Eliminar todos los usuarios (en cascada se borran pedidos, carritos, etc.)
    const deleteResult = await prisma.user.deleteMany({});
    console.log(`🗑️  Eliminados ${deleteResult.count} usuarios`);

    // 2. Crear único usuario admin con credenciales simples
    const email = 'admin@nutreterra.es';
    const password = 'admin123';
    const name = 'Admin NutreTerra';

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('\n✅ Base de datos limpiada exitosamente');
    console.log('\n👤 Único usuario ADMIN creado:');
    console.log('   📧 Email:', admin.email);
    console.log('   🔑 Password:', password);
    console.log('   👤 Nombre:', admin.name);
    console.log('   🎭 Rol: ADMIN');
    console.log('\n⚠️  ESTAS CREDENCIALES SERÁN VISIBLES EN EL FRONTEND\n');

  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

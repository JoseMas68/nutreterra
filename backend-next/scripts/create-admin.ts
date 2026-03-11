import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL,
        },
    },
});

async function main() {
    const email = 'admin@nutreterra.es';
    const password = 'admin123';
    const name = 'Admin NutreTerra';

    console.log(`Checking for admin user: ${email}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email,
            name,
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Admin user ready:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log('   Role: ADMIN');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

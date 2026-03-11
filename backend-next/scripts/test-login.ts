import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testLogin(email: string, password: string) {
    try {
        console.log(`Testing login for: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('User not found in database.');
            return;
        }

        console.log('User found:', { id: user.id, email: user.email, role: user.role });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

    } catch (error) {
        console.error('Error during test login:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Credenciales del seed
testLogin('admin@nutreterra.es', 'admin123');

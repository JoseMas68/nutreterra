import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email';

// GET: Listar todas las plantillas o una específica
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const template = await prisma.emailTemplate.findUnique({
                where: { slug },
            });
            return NextResponse.json(template);
        }

        const templates = await prisma.emailTemplate.findMany({
            orderBy: { updatedAt: 'desc' },
        });

        // Si no hay plantillas, seed por defecto (solo primera vez)
        if (templates.length === 0) {
            await EmailService.seedDefaultTemplates();
            const seeded = await prisma.emailTemplate.findMany();
            return NextResponse.json(seeded);
        }

        return NextResponse.json(templates);
    } catch (error) {
        console.error('Error fetching email templates:', error);
        return NextResponse.json({ error: 'Error al obtener plantillas de email' }, { status: 500 });
    }
}

// PATCH: Actualizar una plantilla
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, subject, body: htmlBody, design } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID de plantilla requerido' }, { status: 400 });
        }

        const updated = await prisma.emailTemplate.update({
            where: { id },
            data: {
                subject,
                body: htmlBody,
                design,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating email template:', error);
        return NextResponse.json({ error: 'Error al actualizar plantilla' }, { status: 500 });
    }
}

// POST: Seed manual o reset de plantillas
export async function POST(req: NextRequest) {
    try {
        await EmailService.seedDefaultTemplates();
        return NextResponse.json({ message: 'Plantillas inicializadas correctamente' });
    } catch (error) {
        console.error('Error seeding templates:', error);
        return NextResponse.json({ error: 'Error al inicializar plantillas' }, { status: 500 });
    }
}

import { Resend } from 'resend';
import { prisma } from './prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  templateSlug: string;
  variables: Record<string, any>;
}

export const EmailService = {
  /**
   * Envía un email utilizando una plantilla de la base de datos
   */
  async send({ to, templateSlug, variables }: SendEmailOptions) {
    try {
      // 1. Buscar la plantilla en la BD
      const template = await prisma.emailTemplate.findUnique({
        where: { slug: templateSlug },
      });

      if (!template) {
        throw new Error(`Template with slug "${templateSlug}" not found`);
      }

      // 2. Renderizar contenido (Simple replace para prototipo)
      let renderedBody = template.body;
      let renderedSubject = template.subject;

      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        renderedBody = renderedBody.replace(regex, String(value));
        renderedSubject = renderedSubject.replace(regex, String(value));
      });

      // 3. Enviar vía Resend
      const { data, error } = await resend.emails.send({
        from: `NutreTerra <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
        to: [to],
        subject: renderedSubject,
        html: renderedBody,
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('EmailService error:', error);
      return { success: false, error };
    }
  },

  /**
   * Inicializa las plantillas por defecto si no existen
   */
  async seedDefaultTemplates() {
    const defaults = [
      {
        slug: 'order-confirmation',
        name: 'Confirmación de Pedido',
        subject: '¡Gracias por tu pedido #{{orderNumber}}!',
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://nutreterra.com/logonutreterra.png" alt="NutreTerra" style="height: 60px;">
            </div>
            <h1 style="color: #7FB14B; text-align: center;">¡Gracias por tu compra!</h1>
            <p>Hola {{customerName}},</p>
            <p>Hemos recibido tu pedido <strong>#{{orderNumber}}</strong> correctamente. Lo estamos preparando con mucho cariño.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Resumen del Pedido</h3>
              <p>Monto Total: <strong>{{totalPrice}}€</strong></p>
              <p>Envío a: {{address}}</p>
            </div>
            <p style="text-align: center; margin-top: 30px;">
              <a href="{{orderUrl}}" style="background: #7FB14B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver mi pedido</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">NutreTerra - Comida real, esfuerzo cero.</p>
          </div>
        `,
        design: {
          primaryColor: '#7FB14B',
          logoUrl: '/logonutreterra.png'
        }
      },
      {
        slug: 'shipping-notification',
        name: 'Notificación de Envío',
        subject: 'Tu pedido #{{orderNumber}} está en camino',
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://nutreterra.com/logonutreterra.png" alt="NutreTerra" style="height: 60px;">
            </div>
            <h1 style="color: #4A7D36; text-align: center;">¡Pedido en camino!</h1>
            <p>Hola {{customerName}},</p>
            <p>¡Buenas noticias! Tu pedido <strong>#{{orderNumber}}</strong> ya ha salido de nuestras cocinas y está en manos del repartidor.</p>
            <p>Lo recibirás en las próximas 24-48 horas.</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="{{trackingUrl}}" style="background: #4A7D36; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Seguir mi envío</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">NutreTerra - Alimentación saludable a domicilio.</p>
          </div>
        `,
        design: {
          primaryColor: '#4A7D36',
          logoUrl: '/logonutreterra.png'
        }
      },
      {
        slug: 'welcome',
        name: 'Bienvenida',
        subject: '¡Bienvenido a NutreTerra, {{customerName}}!',
        body: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://nutreterra.com/logonutreterra.png" alt="NutreTerra" style="height: 60px;">
            </div>
            <h1 style="color: #7FB14B; text-align: center;">¡Hola {{customerName}}!</h1>
            <p>Estamos encantados de tenerte con nosotros. En NutreTerra nos apasiona la comida de verdad, esa que te nutre y te ahorra tiempo.</p>
            <p>Para celebrar tu llegada, aquí tienes un cupón de <strong>5€ de descuento</strong> para tu primer pedido:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background: #F0E8D8; color: #6C4B2F; padding: 15px 30px; border: 2px dashed #6C4B2F; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">BIENVENIDO5</span>
            </div>
            <p style="text-align: center;">
              <a href="{{storeUrl}}" style="background: #E16C50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Empezar a comprar</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">NutreTerra - Nutrición real. Esfuerzo cero.</p>
          </div>
        `,
        design: {
          primaryColor: '#E16C50',
          logoUrl: '/logonutreterra.png'
        }
      }
    ];

    for (const t of defaults) {
      await prisma.emailTemplate.upsert({
        where: { slug: t.slug },
        update: {},
        create: t,
      });
    }
  }
};

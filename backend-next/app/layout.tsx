import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NutreTerra - Panel de Administración',
  description: 'Panel de administración de nutreterra.es - Tienda de alimentación natural y productos ecológicos',
  metadataBase: new URL('https://nutreterra.es'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

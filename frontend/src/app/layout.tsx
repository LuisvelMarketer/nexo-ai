import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXO - Tu asistente IA personal',
  description: 'Control total del celular por voz. Jarvis en tu bolsillo.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

/**
 * Componente Toaster - Contenedor de notificaciones toast
 * Para usar en el layout del admin
 */
export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          fontSize: '14px',
          borderRadius: '8px',
          padding: '12px 16px',
          maxWidth: '400px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 99999,
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#064e3b',
            border: '1px solid #10b981',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#7f1d1d',
            border: '1px solid #ef4444',
          },
        },
        loading: {
          style: {
            background: '#1e3a5f',
            border: '1px solid #3b82f6',
          },
        },
      }}
    />
  );
}

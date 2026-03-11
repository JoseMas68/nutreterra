'use client';

import toast from 'react-hot-toast';

/**
 * Sistema de notificaciones toast para el backend
 * Uso: import { toastSuccess, toastError, toastLoading, toast } from '@/lib/toast'
 */

export const toastSuccess = (message: string) => {
  return toast.success(message, {
    icon: '✅',
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
};

export const toastError = (message: string) => {
  return toast.error(message, {
    icon: '❌',
    duration: 5000,
    ariaProps: {
      role: 'alert',
      'aria-live': 'assertive',
    },
  });
};

export const toastLoading = (message: string = 'Procesando...') => {
  return toast.loading(message, {
    icon: '⏳',
  });
};

export const toastInfo = (message: string) => {
  return toast(message, {
    icon: 'ℹ️',
    duration: 4000,
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
};

export const toastWarning = (message: string) => {
  return toast(message, {
    icon: '⚠️',
    duration: 4500,
    style: {
      background: '#78350f',
      border: '1px solid #f59e0b',
    },
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
};

export const toastPromise = async <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, messages);
};

export { toast };

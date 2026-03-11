import { toastSuccess, toastError, toastWarning, toastInfo, toastPromise } from '../lib/toast';

/**
 * Ejemplo de componente con Toast Notifications
 * Este componente muestra cómo usar los diferentes tipos de toasts
 */
export default function ToastExample() {
  const handleSuccess = () => {
    toastSuccess('Producto añadido al carrito');
  };

  const handleError = () => {
    toastError('Error al conectar con el servidor');
  };

  const handleWarning = () => {
    toastWarning('Solo quedan 2 unidades en stock');
  };

  const handleInfo = () => {
    toastInfo('Envío gratuito en pedidos superiores a 50€');
  };

  const handlePromise = async () => {
    await toastPromise(
      new Promise((resolve) => setTimeout(() => resolve('ok'), 2000)),
      {
        loading: 'Procesando pedido...',
        success: 'Pedido procesado correctamente',
        error: 'Error al procesar el pedido',
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow">
      <button
        onClick={handleSuccess}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        ✅ Success
      </button>
      <button
        onClick={handleError}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        ❌ Error
      </button>
      <button
        onClick={handleWarning}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
      >
        ⚠️ Warning
      </button>
      <button
        onClick={handleInfo}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        ℹ️ Info
      </button>
      <button
        onClick={handlePromise}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
      >
        ⏳ Promise
      </button>
    </div>
  );
}

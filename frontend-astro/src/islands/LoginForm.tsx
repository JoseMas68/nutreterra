import { useState } from 'react';
import { login } from '../stores/authStore';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirigir a la cuenta
      window.location.href = '/cuenta';
    } else {
      setError(result.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="tu@email.com"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="••••••••"
        />
      </div>

      {/* Forgot Password Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Recordarme
          </label>
        </div>
        <a href="#" className="text-sm text-primary hover:text-leaf transition-colors">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-leaf transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}

import { useState } from 'react';
import { register } from '../stores/authStore';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    const result = await register(name, email, password);

    if (result.success) {
      // Redirigir a la cuenta
      window.location.href = '/cuenta';
    } else {
      setError(result.error || 'Error al crear la cuenta');
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

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre completo
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="Juan Pérez"
        />
      </div>

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
          minLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="••••••••"
        />
        <p className="mt-1 text-sm text-gray-500">Mínimo 6 caracteres</p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
          Confirmar contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="••••••••"
        />
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start">
        <input
          id="terms"
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          Acepto los{' '}
          <a href="#" className="text-primary hover:text-leaf">
            términos y condiciones
          </a>{' '}
          y la{' '}
          <a href="#" className="text-primary hover:text-leaf">
            política de privacidad
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-leaf transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
}

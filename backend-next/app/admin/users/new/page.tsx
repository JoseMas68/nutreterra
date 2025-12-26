'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name || !formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear usuario');
      }

      const data = await response.json();

      // Si necesitamos cambiar el rol a ADMIN, hacer una actualización adicional
      if (formData.role === 'ADMIN') {
        const token = localStorage.getItem('authToken');
        if (token) {
          const parsedToken = JSON.parse(token);

          await fetch(`/api/users/${data.user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${parsedToken}`,
            },
            body: JSON.stringify({ role: 'ADMIN' }),
          });
        }
      }

      alert('Usuario creado correctamente');
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/users"
          className="text-primary hover:text-leaf transition-colors mb-4 inline-block"
        >
          ← Volver a Usuarios
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
        <p className="text-gray-600 mt-2">
          Crea una nueva cuenta de usuario en el sistema
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow rounded-lg p-8 max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Juan Pérez"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="juan@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500 mt-1">
              El usuario usará este email para iniciar sesión
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Repite la contraseña"
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="CUSTOMER">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Los administradores tienen acceso al panel de administración
            </p>
          </div>

          <div className="border-t pt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-leaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando usuario...' : 'Crear Usuario'}
            </button>
            <Link
              href="/admin/users"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Información importante:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• El usuario recibirá las credenciales que establezcas aquí</li>
            <li>• Se recomienda que el usuario cambie su contraseña al iniciar sesión</li>
            <li>• Los administradores pueden acceder a este panel de administración</li>
            <li>• Los clientes solo tienen acceso a su panel de usuario</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

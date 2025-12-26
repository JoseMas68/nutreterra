'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    params.then(p => setUserId(p.id));
  }, [params]);

  useEffect(() => {
    if (userId) loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) return;

      // Cargar usuario
      const userResponse = await fetch(`/api/users/${userId}`, {
        credentials: 'include', // Incluir cookies de sesión de NextAuth
      });

      if (!userResponse.ok) {
        throw new Error('Error al cargar usuario');
      }

      const userData = await userResponse.json();
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email,
        role: userData.role,
      });

      // Cargar direcciones
      const addressResponse = await fetch(`/api/users/${userId}/addresses`, {
        credentials: 'include', // Incluir cookies de sesión de NextAuth
      });

      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        setAddresses(addressData.addresses);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies de sesión de NextAuth
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar usuario');
      }

      await loadUserData();
      setEditMode(false);
      alert('Usuario actualizado correctamente');
    } catch (err: any) {
      alert(err.message || 'Error al actualizar usuario');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || 'Usuario no encontrado'}
      </div>
    );
  }

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name || user.email}
            </h1>
            <p className="text-gray-600 mt-2">ID: {user.id}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              user.role === 'ADMIN'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Información del Usuario</h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-leaf transition-colors"
            >
              Editar
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="CUSTOMER">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-leaf transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: user.name || '',
                    email: user.email,
                    role: user.role,
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="text-lg font-medium text-gray-900">{user.name || 'Sin nombre'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Verificado</p>
              <p className="text-lg font-medium text-gray-900">
                {user.emailVerified ? 'Sí' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Registro</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Direcciones */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Direcciones ({addresses.length})
        </h2>

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            El usuario no tiene direcciones registradas
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 rounded-lg border-2 ${
                  address.isDefault
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                {address.isDefault && (
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-2">
                    Principal
                  </span>
                )}
                <p className="font-semibold text-gray-900">
                  {address.firstName} {address.lastName}
                </p>
                <p className="text-sm text-gray-600 mt-2">{address.street}</p>
                <p className="text-sm text-gray-600">
                  {address.postalCode}, {address.city}
                </p>
                <p className="text-sm text-gray-600">
                  {address.state}, {address.country}
                </p>
                <p className="text-sm text-gray-600 mt-2">{address.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          slug: formData.get('slug'),
          description: formData.get('description'),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError('Error al crear la categoría');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-[#7FB14B] hover:text-[#4A7D36] text-sm"
        >
          ← Volver a categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Nueva Categoría</h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm px-4 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              placeholder="cereales-ecologicos"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm px-4 py-2 border"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL amigable (sin espacios, solo letras, números y guiones)
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm px-4 py-2 border"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href="/admin/categories"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#7FB14B] hover:bg-[#4A7D36] text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}

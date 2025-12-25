'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      setCategoryId(p.id);
      fetchCategory(p.id);
    });
  }, []);

  const fetchCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`);
      if (!response.ok) throw new Error('Error al cargar la categoría');
      const data = await response.json();
      setCategory(data);
    } catch (err) {
      setError('Error al cargar la categoría');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryId) return;

    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
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
        throw new Error('Error al actualizar la categoría');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError('Error al actualizar la categoría');
      setLoading(false);
    }
  };

  if (!category) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-[#7FB14B] hover:text-[#4A7D36] text-sm"
        >
          ← Volver a categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Editar Categoría</h1>
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
              defaultValue={category.name}
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
              defaultValue={category.slug}
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
              defaultValue={category.description || ''}
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
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

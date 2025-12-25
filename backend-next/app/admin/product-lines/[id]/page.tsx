'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductLine {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export default function EditProductLinePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productLine, setProductLine] = useState<ProductLine | null>(null);
  const [lineId, setLineId] = useState<string | null>(null);
  const [iconContent, setIconContent] = useState('');
  const [iconPreview, setIconPreview] = useState('');

  useEffect(() => {
    params.then((p) => {
      setLineId(p.id);
      fetchProductLine(p.id);
    });
  }, []);

  const fetchProductLine = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/product-lines/${id}`);
      if (!response.ok) throw new Error('Error al cargar la línea de producto');
      const data = await response.json();
      setProductLine(data);
      setIconContent(data.icon);
      setIconPreview(data.icon);
    } catch (err) {
      setError('Error al cargar la línea de producto');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg')) {
      setError('Por favor, selecciona un archivo SVG válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setIconContent(content);
      setIconPreview(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lineId) return;

    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/api/admin/product-lines/${lineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          slug: formData.get('slug'),
          description: formData.get('description'),
          icon: iconContent,
          order: parseInt(formData.get('order') as string),
          active: formData.get('active') === 'on',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la línea de producto');
      }

      router.push('/admin/product-lines');
      router.refresh();
    } catch (err) {
      setError('Error al actualizar la línea de producto');
      setLoading(false);
    }
  };

  if (!productLine) {
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
          href="/admin/product-lines"
          className="text-[#7FB14B] hover:text-[#4A7D36] text-sm"
        >
          ← Volver a líneas de producto
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Editar Línea de Producto</h1>
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
              defaultValue={productLine.name}
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
              defaultValue={productLine.slug}
              placeholder="livela"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm px-4 py-2 border"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL amigable (sin espacios, solo letras, números y guiones)
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              defaultValue={productLine.description}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm px-4 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              Icono SVG *
            </label>

            <div className="mt-2 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Opción 1: Subir archivo SVG
                </label>
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#7FB14B] file:text-white hover:file:bg-[#4A7D36]"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Opción 2: Editar código SVG
                </label>
                <textarea
                  id="icon"
                  name="icon"
                  rows={3}
                  value={iconContent}
                  onChange={(e) => {
                    setIconContent(e.target.value);
                    setIconPreview(e.target.value);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm px-4 py-2 border font-mono text-xs"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Puedes usar iconos de <a href="https://heroicons.com" target="_blank" className="text-[#7FB14B] hover:underline">Heroicons</a>
                </p>
              </div>
            </div>

            {iconPreview && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Vista previa:</span>
                  <div
                    className="w-8 h-8 text-[#7FB14B]"
                    dangerouslySetInnerHTML={{ __html: iconPreview }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">
              Orden
            </label>
            <input
              type="number"
              id="order"
              name="order"
              min="0"
              defaultValue={productLine.order}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm px-4 py-2 border"
            />
            <p className="mt-1 text-sm text-gray-500">
              Orden de visualización (menor número aparece primero)
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              defaultChecked={productLine.active}
              className="h-4 w-4 text-[#7FB14B] focus:ring-[#7FB14B] border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Línea activa (visible en la tienda)
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href="/admin/product-lines"
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

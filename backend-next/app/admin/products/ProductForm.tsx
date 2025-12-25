'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string;
  images: string[];
  weight: number | null;
  active: boolean;
  featured: boolean;
  categoryId: string;
  tags: { tagId: string }[];
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  tags: Tag[];
}

export default function ProductForm({ product, categories, tags }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(product?.images || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.tags.map(t => t.tagId) || []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Añadir tags seleccionados
      formData.append('tags', JSON.stringify(selectedTags));

      // Añadir imagen principal si hay una nueva
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Añadir imágenes de galería
      galleryFiles.forEach((file, index) => {
        formData.append(`gallery_${index}`, file);
      });
      formData.append('galleryCount', galleryFiles.length.toString());

      // Mantener imágenes existentes
      if (product?.images) {
        formData.append('existingImages', JSON.stringify(galleryPreviews.filter(url => url.startsWith('http'))));
      }

      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';

      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al guardar el producto');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Información Básica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del Producto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={product?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU *
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              required
              defaultValue={product?.sku}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug (URL) *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              defaultValue={product?.slug}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={product?.categoryId}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Precio *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700">
              Precio de Comparación
            </label>
            <input
              type="number"
              id="compareAtPrice"
              name="compareAtPrice"
              step="0.01"
              min="0"
              defaultValue={product?.compareAtPrice || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              required
              defaultValue={product?.stock}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Peso (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.001"
              min="0"
              defaultValue={product?.weight || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
            Descripción Corta *
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            required
            defaultValue={product?.shortDescription || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción Completa *
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            defaultValue={product?.description}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7FB14B] focus:ring-[#7FB14B] sm:text-sm"
          />
        </div>
      </div>

      {/* Imagen */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Imagen del Producto</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen Principal {!product && '*'}
          </label>

          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-48 w-48 object-cover rounded-md"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7FB14B] file:text-white hover:file:bg-[#4A7D36]"
          />
          <p className="mt-1 text-sm text-gray-500">
            Recomendado: 600x600px, formato JPG o WebP
          </p>
        </div>

        {/* Galería de imágenes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Galería de Imágenes (opcional)
          </label>

          {galleryPreviews.length > 0 && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Galería ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7FB14B] file:text-white hover:file:bg-[#4A7D36]"
          />
          <p className="mt-1 text-sm text-gray-500">
            Puedes seleccionar múltiples imágenes. Recomendado: 600x600px
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Etiquetas</h2>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-[#7FB14B] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Estado */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Estado</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              defaultChecked={product?.active ?? true}
              className="h-4 w-4 text-[#7FB14B] focus:ring-[#7FB14B] border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Producto activo (visible en la tienda)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 text-[#7FB14B] focus:ring-[#7FB14B] border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Producto destacado (mostrar en página principal)
            </label>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7FB14B] hover:bg-[#4A7D36] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : product ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
}

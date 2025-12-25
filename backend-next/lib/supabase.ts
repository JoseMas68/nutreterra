import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente de Supabase con privilegios de administrador para operaciones del servidor
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función helper para subir imagen de producto
export async function uploadProductImage(file: File, fileName: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // Obtener URL pública de la imagen
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

// Función helper para eliminar imagen de producto
export async function deleteProductImage(fileName: string): Promise<boolean> {
  const { error } = await supabaseAdmin.storage
    .from('product-images')
    .remove([fileName]);

  if (error) {
    console.error('Error deleting image:', error);
    return false;
  }

  return true;
}

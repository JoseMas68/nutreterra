import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el origen de la solicitud
  const origin = request.headers.get('origin');
  
  // Verificar si es una ruta de API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Configurar respuesta inicial
    const response = NextResponse.next();

    // Agregar headers CORS
    // Permitir cualquier origen en desarrollo, o específicamente el frontend
    if (origin) {
       response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
       response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    // Manejar preflight requests (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

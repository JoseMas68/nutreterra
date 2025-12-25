export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>NutreTerra API</h1>
      <p>Backend API para NutreTerra - E-commerce de productos naturales</p>

      <h2>Endpoints disponibles:</h2>
      <ul>
        <li>
          <strong>Auth:</strong>
          <ul>
            <li>POST /api/auth/register - Registro de usuarios</li>
            <li>POST /api/auth/signin - Login (NextAuth)</li>
          </ul>
        </li>
        <li>
          <strong>Products:</strong>
          <ul>
            <li>GET /api/products - Listar productos</li>
            <li>GET /api/products/[slug] - Obtener producto por slug</li>
          </ul>
        </li>
        <li>
          <strong>Categories:</strong>
          <ul>
            <li>GET /api/categories - Listar categorías</li>
            <li>GET /api/categories/[slug] - Obtener categoría por slug</li>
          </ul>
        </li>
      </ul>

      <h2>Database:</h2>
      <p>Para inicializar la base de datos:</p>
      <ol>
        <li>Asegúrate de tener PostgreSQL corriendo</li>
        <li>Ejecuta: <code>npm run prisma:migrate</code></li>
        <li>Ejecuta: <code>npm run prisma:seed</code></li>
      </ol>
    </div>
  );
}

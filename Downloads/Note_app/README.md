# Notas App - Full Stack

Una aplicación web moderna para gestionar tus notas personales. Backend con NestJS + MySQL y Frontend con React + Vite.

## Características

- ✅ Crear, editar, eliminar notas
- ✅ Archivar y desarchivar notas
- ✅ Filtrar por estado (Activas/Archivadas)
- ✅ Interfaz moderna y responsive
- ✅ API RESTful robusta
- ✅ Base de datos persistente con MySQL

## Stack Tecnológico

### Backend
- **Framework**: NestJS 10.x (Node.js)
- **Base de datos**: MySQL 8.0+
- **ORM**: TypeORM 0.3.x
- **Validación**: class-validator
- **Arquitectura**: Capas (Controllers → Services → Repositories)

### Frontend
- **Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Estilos**: Tailwind CSS 3.x
- **HTTP Client**: Axios
- **Lenguaje**: TypeScript

## Requisitos

- Node.js 18+
- npm/pnpm 7+
- MySQL 8.0+

## Instalación Rápida

### Opción 1: Script automático (Linux/macOS)

```bash
chmod +x setup.sh
./setup.sh
```

### Opción 2: Manual

```bash
# Backend
cd backend
npm install

# Frontend
cd ../Frontend
npm install
```

## Ejecución

### Terminal 1: Base de datos
```bash
mysql -u root -p
# Ejecuta:
CREATE DATABASE IF NOT EXISTS notes_app;
GRANT ALL PRIVILEGES ON notes_app.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Terminal 2: Backend
```bash
cd backend
npm run start:dev
# El servidor estará en http://localhost:3001
```

### Terminal 3: Frontend
```bash
cd Frontend
npm run dev
# La app estará en http://localhost:5173
```

## Documentación Completa

Para instrucciones detalladas de instalación y solución de problemas, consulta:

📖 [deploylocal.md](./deploylocal.md)

## Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── notes/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   └── notes.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── deploylocal.md
├── setup.sh
└── README.md
```

## Arquitectura

### Backend - Capas

1. **Controller** (`NotesController`)
   - Maneja las rutas HTTP
   - Valida las requests
   - Devuelve responses

2. **Service** (`NotesService`)
   - Contiene la lógica de negocio
   - Maneja excepciones
   - Orquesta operaciones

3. **Repository** (`NotesRepository`)
   - Acceso directo a la base de datos
   - Operaciones CRUD
   - Queries personalizadas

4. **Entity** (`Note`)
   - Define la estructura de datos
   - Mapeo con tabla MySQL

### Frontend - Componentes

1. **App.tsx**
   - Componente principal
   - Gestiona estado global
   - Maneja llamadas API

2. **NoteForm.tsx**
   - Formulario para crear/editar

3. **NoteItem.tsx**
   - Componente individual de nota

4. **notesApi.ts**
   - Cliente HTTP centralizado

## API Endpoints

```
Base URL: http://localhost:3001/api/notes

GET    /              - Obtener todas las notas
GET    /active        - Obtener notas activas
GET    /archived      - Obtener notas archivadas
GET    /:id           - Obtener nota por ID
POST   /              - Crear nota
PUT    /:id           - Actualizar nota
POST   /:id/archive   - Archivar nota
POST   /:id/unarchive - Desarchivar nota
DELETE /:id           - Eliminar nota
```

## Variables de Entorno

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=notes_app
NODE_ENV=development
PORT=3001
```

## Desarrollo

### Scripts Backend

```bash
npm run start:dev      # Desarrollo con hot reload
npm run build          # Compilar
npm run start:prod     # Producción
npm run lint          # Linting
```

### Scripts Frontend

```bash
npm run dev           # Desarrollo
npm run build         # Compilar
npm run preview       # Vista previa
```

## Mejoras Futuras

- [ ] Autenticación de usuarios
- [ ] Categorías/etiquetas para notas
- [ ] Búsqueda full-text
- [ ] Sincronización en tiempo real (WebSockets)
- [ ] Exportar notas (PDF, Markdown)
- [ ] Compartir notas
- [ ] Modo oscuro

## Troubleshooting

### "Cannot GET /api/notes"
- Verifica que el backend está corriendo en puerto 3001

### "ECONNREFUSED 127.0.0.1:3306"
- MySQL no está corriendo. Inicia el servicio

### "CORS error"
- El frontend debe estar en http://localhost:5173

Más detalles en [deploylocal.md](./deploylocal.md)

## Licencia

MIT

---

Creado con ❤️ | [Guía completa](./deploylocal.md)

# Guía de Despliegue Local

## Requisitos Previos

- **Node.js**: v18 o superior ([Descargar](https://nodejs.org/))
- **npm/pnpm**: Gestor de paquetes (incluido con Node.js)
- **MySQL**: v8.0 o superior ([Descargar](https://www.mysql.com/downloads/))

## Estructura del Proyecto

```
.
├── backend/          # API NestJS
├── Frontend/         # Aplicación React + Vite
├── README.md
└── deploylocal.md    # Este archivo
```

## Paso 1: Configurar la Base de Datos MySQL

### 1.1 Iniciar el servidor MySQL

**En Windows:**
```bash
# Abre SQL Command Line o MySQL Workbench
mysql -u root -p
```

**En macOS (con Homebrew):**
```bash
brew services start mysql
mysql -u root -p
```

**En Linux:**
```bash
sudo systemctl start mysql
mysql -u root -p
```

### 1.2 Crear la base de datos

Ejecuta estas sentencias SQL en tu cliente MySQL:

```sql
CREATE DATABASE IF NOT EXISTS notes_app;
GRANT ALL PRIVILEGES ON notes_app.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Paso 2: Configurar el Backend

### 2.1 Navega a la carpeta backend

```bash
cd backend
```

### 2.2 Instala las dependencias

```bash
npm install
```

O con pnpm:
```bash
pnpm install
```

### 2.3 Configura variables de entorno

Verifica que el archivo `.env` contiene:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=notes_app
NODE_ENV=development
PORT=3001
```

Si necesitas cambiar las credenciales de MySQL, actualiza estos valores en `.env`.

### 2.4 Inicia el servidor backend

```bash
npm run start:dev
```

Deberías ver:
```
[NestFactory] Starting NestJS application...
Application is running on: http://localhost:3001
```

El backend estará disponible en `http://localhost:3001`

## Paso 3: Configurar el Frontend

### 3.1 En otra terminal, navega a la carpeta Frontend

```bash
cd Frontend
```

### 3.2 Instala las dependencias

```bash
npm install
```

O con pnpm:
```bash
pnpm install
```

### 3.3 Inicia el servidor de desarrollo

```bash
npm run dev
```

Deberías ver:
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Paso 4: Acceder a la Aplicación

Abre tu navegador y ve a:

```
http://localhost:5173
```

## Funcionalidades Disponibles

- ✅ **Crear notas**: Completa el formulario y haz clic en "Guardar"
- ✅ **Ver notas**: Lista completa de notas activas
- ✅ **Editar notas**: Haz clic en el botón ✎ para editar
- ✅ **Archivar notas**: Haz clic en 📦 para archivar o ↺ para desarchivar
- ✅ **Eliminar notas**: Haz clic en 🗑 para eliminar
- ✅ **Filtrar notas**: Usa los botones "Todas", "Activas", "Archivadas"

## Estructura de Carpetas Explicada

### Backend (`/backend`)

```
backend/
├── src/
│   ├── notes/
│   │   ├── entities/        # Modelos de datos (TypeORM)
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── repositories/   # Capa de acceso a datos (DAO)
│   │   ├── services/       # Lógica de negocio
│   │   ├── controllers/    # Rutas y handlers
│   │   └── notes.module.ts # Módulo NestJS
│   ├── app.module.ts       # Módulo raíz
│   └── main.ts             # Punto de entrada
├── .env                    # Variables de configuración
├── package.json
└── tsconfig.json
```

### Frontend (`/Frontend`)

```
Frontend/
├── src/
│   ├── components/
│   │   ├── NoteForm.tsx    # Formulario de notas
│   │   └── NoteItem.tsx    # Componente individual de nota
│   ├── services/
│   │   └── notesApi.ts     # Cliente HTTP con axios
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada React
│   └── index.css           # Estilos Tailwind
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Endpoints de la API

Todos los endpoints están prefijados con `/api/notes`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Obtener todas las notas |
| GET | `/active` | Obtener notas activas |
| GET | `/archived` | Obtener notas archivadas |
| GET | `/:id` | Obtener nota por ID |
| POST | `/` | Crear nueva nota |
| PUT | `/:id` | Actualizar nota |
| POST | `/:id/archive` | Archivar nota |
| POST | `/:id/unarchive` | Desarchivar nota |
| DELETE | `/:id` | Eliminar nota |

## Solución de Problemas

### Error: "Cannot GET /api/notes"
- Asegúrate de que el backend está corriendo en `http://localhost:3001`
- Verifica que no hay errores en la terminal del backend

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
- MySQL no está corriendo. Inicia el servidor MySQL
- Verifica las credenciales en `.env` coincidan con tu setup

### Error: "CORS error"
- Asegúrate de que el backend tiene CORS habilitado (ya está configurado)
- El frontend debe estar en `http://localhost:5173`

### Las notas no persisten después de reiniciar
- Las notas se guardan en MySQL, no en memoria
- Verifica que la base de datos está corriendo

## Scripts Útiles

### Backend

```bash
# Desarrollo con hot reload
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm run start:prod

# Linting
npm run lint
```

### Frontend

```bash
# Desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Vista previa de la build
npm run preview
```

## Detener la Aplicación

Para detener los servidores:

1. **Backend**: Presiona `Ctrl+C` en la terminal del backend
2. **Frontend**: Presiona `Ctrl+C` en la terminal del frontend
3. **MySQL**: 
   - Windows: Panel de Control → Servicios → Detener MySQL
   - macOS: `brew services stop mysql`
   - Linux: `sudo systemctl stop mysql`

## Notas Importantes

- La aplicación usa TypeORM para manejar la base de datos
- Los datos se sincronizan automáticamente con MySQL en desarrollo (`synchronize: true`)
- CORS está configurado para permitir requests desde `http://localhost:5173`
- Las validaciones se hacen tanto en backend (class-validator) como en frontend

## Próximos Pasos (Opcional)

- Agregar categorías a las notas
- Implementar búsqueda y filtros avanzados
- Agregar autenticación de usuarios
- Desplegar en un servidor remoto (Heroku, DigitalOcean, etc.)

---

¿Preguntas? Revisa el archivo `README.md` para más información sobre la arquitectura.

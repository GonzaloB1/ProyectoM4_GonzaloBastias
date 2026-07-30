# MateCode Tasks

Aplicación web de gestión de tareas con autenticación, persistencia en tiempo real y envío de resúmenes por email. Proyecto Integrador 4 — Henry.

**Demo en vivo:** https://matecode-tasks-gonza4.vercel.app/

## Stack tecnológico

- **Frontend:** React + TypeScript + Vite
- **Autenticación y base de datos:** Firebase (Authentication + Firestore)
- **Envío de email:** AWS SES a través de una función serverless (Vercel Functions)
- **Testing:** Vitest + React Testing Library
- **Deploy:** Vercel

## Arquitectura

El proyecto está organizado por capas, separando responsabilidades:

```
src/
├─ pages/            # Vistas completas (Login, Register, Tasks)
├─ components/       # UI reutilizable (LogoutButton, TaskForm, TaskList)
├─ features/         # Lógica de negocio por dominio (auth: Context, Provider, hook)
├─ services/         # Comunicación con servicios externos (Firebase, email)
├─ routes/           # Control de acceso (ProtectedRoute, PublicOnlyRoute)
├─ hooks/            # Lógica reutilizable con estado (useTasks)
├─ types/            # Definiciones de TypeScript (Task, AuthContextType)
└─ utils/            # Funciones puras (traducción de errores de Firebase)

api/
└─ send-summary.ts   # Función serverless: envía el resumen por email vía AWS SES

firestore.rules        # Reglas de seguridad de Firestore (versionadas)
firebase.json           # Config del Firebase CLI para desplegar las reglas
```

## Decisiones de arquitectura

- **Context + Provider + custom hook para auth (`useAuth`):** el estado de sesión lo necesita toda la app (rutas, header, formularios), así que se centralizó en un Context en vez de pasar props manualmente entre componentes.
- **`onAuthStateChanged` y `onSnapshot` (patrón Observer):** tanto el estado de sesión como las tareas se mantienen sincronizados automáticamente, sin necesidad de refrescar la página ni hacer polling manual.
- **Separación `Task` / `NewTask`:** el tipo de una tarea existente (con `id`, `completed`, `createdAt` generados por el sistema) se separó del tipo de una tarea nueva (lo que el usuario efectivamente ingresa), para que TypeScript no permita crear una tarea con campos que no le corresponden al usuario.
- **Función serverless para el email:** las credenciales de AWS nunca llegan al frontend. El navegador solo le habla a `/api/send-summary` (que corre en el servidor), y es esa función la que tiene las credenciales y le habla a AWS SES.
- **Reglas de seguridad de Firestore:** además del filtro `where("userId", "==", ...)` en la query, las reglas de Firestore bloquean del lado del servidor cualquier intento de leer o escribir tareas de otro usuario, incluso si alguien manipulara el código del cliente.

## Instalación y desarrollo local

Requiere Node 18+ y una cuenta de Firebase con Authentication (Email/Password) y Firestore habilitados.

```bash
git clone https://github.com/GonzaloB1/ProyectoM4_GonzaloBastias.git
cd ProyectoM4_GonzaloBastias
npm install
cp .env.example .env
# completar .env con las credenciales reales (ver sección Variables de entorno)
vercel dev
```

Se usa `vercel dev` en vez de `npm run dev` porque el proyecto incluye una función serverless (`/api/send-summary`) que Vite por sí solo no puede servir — Vercel CLI simula ese entorno localmente.

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el frontend con Vite (no sirve `/api/*`) |
| `vercel dev` | Levanta frontend + función serverless simulada |
| `npm run build` | Type-check (`tsc -b`) + build de producción |
| `npm run test` | Corre la suite de Vitest |
| `npm run preview` | Sirve el build de producción localmente |

## Variables de entorno

`.env` nunca se sube al repositorio (está en `.gitignore`); `.env.example` sí, sin valores reales. Las variables `VITE_*` son las únicas visibles desde el navegador — las de AWS solo existen del lado del servidor (función serverless), por eso no llevan ese prefijo.

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Frontend | Config del proyecto de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Frontend | Dominio de autenticación de Firebase |
| `VITE_FIREBASE_PROJECT_ID` | Frontend | ID del proyecto de Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Frontend | Bucket de Firebase Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Frontend | Sender ID de Firebase Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | Frontend | ID de la app de Firebase |
| `AWS_ACCESS_KEY_ID` | Serverless (`api/`) | Credencial de un usuario IAM con permiso de `ses:SendEmail` |
| `AWS_SECRET_ACCESS_KEY` | Serverless (`api/`) | Secret correspondiente al access key |
| `AWS_REGION` | Serverless (`api/`) | Región de AWS donde está verificado el email en SES |
| `SES_SENDER_EMAIL` | Serverless (`api/`) | Remitente verificado en AWS SES |

En Vercel, estas variables se configuran en Project Settings → Environment Variables, con scope por entorno (Production/Preview/Development). Un detalle no evidente: guardar una variable nueva no alcanza para que un deploy ya existente la tome — hace falta un redeploy (`vercel --prod`) para que la función serverless la lea.

## Testing

```bash
npm run test
```

Se testeó `getAuthErrorMessage` (lógica pura de traducción de errores), el componente `Login` (con mocks de `authService`, cubriendo tanto el caso de éxito como el caso de credenciales incorrectas) y los componentes principales de tareas `TaskForm` y `TaskList` (con mocks de `taskService` y `useAuth`, cubriendo creación, edición, completado y borrado de tareas).

## Seguridad

- `.env` está en `.gitignore`; `.env.example` documenta las claves sin valores reales.
- Las reglas de Firestore (`firestore.rules`, versionadas en el repo) restringen cada documento de tarea a su `userId`: un usuario autenticado no puede leer ni escribir tareas de otro, ni siquiera manipulando el cliente. Se despliegan con `firebase deploy --only firestore:rules`.
- Además de las reglas del servidor, el cliente filtra explícitamente por `where("userId", "==", user.uid)` en cada consulta.
- Las rutas de tareas están protegidas con `ProtectedRoute`, que espera a que se resuelva el estado de auth antes de decidir si redirige, evitando redirecciones prematuras.
- Las credenciales de AWS SES nunca llegan al bundle del cliente — solo existen dentro de `api/send-summary.ts`, que corre en el servidor.

## Uso de IA en el desarrollo

Se utilizó Claude (Anthropic) como asistente durante todo el desarrollo, en modalidad guiada paso a paso: se pedía la explicación conceptual de cada hito antes de escribir código, y la implementación se hacía revisando y ejecutando cada bloque manualmente.

Prompts principales utilizados:
- Explicación de cada hito de la guía del PI4 antes de implementarlo (setup, Firebase, auth, rutas protegidas, modelo de datos, CRUD en tiempo real, AWS SES + serverless, testing, deploy).
- Diagnóstico de errores concretos durante el desarrollo (índices de Firestore faltantes, problemas de capitalización de archivos entre Windows y Linux, configuración de variables de entorno en Vercel).

Cómo influyeron en la implementación:
- Las explicaciones previas a cada bloque de código ayudaron a entender el porqué de cada decisión antes de escribirla, en vez de copiar código sin comprenderlo.
- Los errores reales encontrados durante el proceso (índice de Firestore, capitalización de archivos en el build de producción, configuración del entorno Development en Vercel) se resolvieron identificando la causa raíz en cada caso, no solo aplicando una solución genérica.

Decisiones tomadas a partir de las respuestas generadas:
- Se decidió desplegar en Vercel antes de terminar el pulido visual (CSS), siguiendo la recomendación de la guía de "desplegar temprano" — esto permitió detectar y corregir a tiempo el problema de capitalización de archivos entre Windows y Linux, que no se hubiera manifestado en desarrollo local.
- Se priorizó un set acotado de tests (con mocks de Firebase) en vez de cobertura extensa, dado el tiempo disponible, enfocándose en comportamiento crítico (traducción de errores de auth) en vez de tests superficiales de renderizado.
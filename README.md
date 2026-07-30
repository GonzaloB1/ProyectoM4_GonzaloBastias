# MateCode Tasks

Aplicación web de gestión de tareas con autenticación, persistencia en tiempo real y envío de resúmenes por email. Proyecto Integrador 4 — Henry.

## Stack tecnológico

- **Frontend:** React + TypeScript + Vite
- **Autenticación y base de datos:** Firebase (Authentication + Firestore)
- **Envío de email:** AWS SES a través de una función serverless (Vercel Functions)
- **Testing:** Vitest + React Testing Library
- **Deploy:** Vercel

## Arquitectura

El proyecto está organizado por capas, separando responsabilidades:

- pages/ → Vistas completas (Login, Register, Tasks)
- components/ → UI reutilizable (LogoutButton, TaskForm, TaskList)
- features/ → Lógica de negocio por dominio (auth: Context, Provider, hook)
- services/ → Comunicación con servicios externos (Firebase, email)
- routes/ → Control de acceso (ProtectedRoute, PublicOnlyRoute)
- hooks/ → Lógica reutilizable con estado (useTasks)
- types/ → Definiciones de TypeScript (Task, AuthContextType)
- utils/ → Funciones puras (traducción de errores de Firebase)
- api/send-summary.ts → Función serverless: envía el resumen por email vía AWS SES

## Decisiones de arquitectura

- **Context + Provider + custom hook para auth (useAuth):** el estado de sesión lo necesita toda la app (rutas, header, formularios), así que se centralizó en un Context en vez de pasar props manualmente entre componentes.
- **onAuthStateChanged y onSnapshot (patrón Observer):** tanto el estado de sesión como las tareas se mantienen sincronizados automáticamente, sin necesidad de refrescar la página ni hacer polling manual.
- **Separación Task / NewTask:** el tipo de una tarea existente (con id, completed, createdAt generados por el sistema) se separó del tipo de una tarea nueva (lo que el usuario efectivamente ingresa), para que TypeScript no permita crear una tarea con campos que no le corresponden al usuario.
- **Función serverless para el email:** las credenciales de AWS nunca llegan al frontend. El navegador solo le habla a /api/send-summary (que corre en el servidor), y es esa función la que tiene las credenciales y le habla a AWS SES.
- **Reglas de seguridad de Firestore:** además del filtro where("userId", "==", ...) en la query, las reglas de Firestore bloquean del lado del servidor cualquier intento de leer o escribir tareas de otro usuario, incluso si alguien manipulara el código del cliente.

## Variables de entorno

Ver .env.example para la lista completa. Las variables con prefijo VITE_ son necesarias para el frontend (Firebase) y son públicas por diseño. Las variables sin prefijo (AWS_*, SES_SENDER_EMAIL) son exclusivas del servidor y nunca se exponen al navegador.

## Cómo correr el proyecto localmente

npm install
vercel dev

Se usa vercel dev en vez de npm run dev porque el proyecto incluye una función serverless (/api/send-summary) que Vite por sí solo no puede servir — Vercel CLI simula ese entorno localmente.

## Testing

npm run test

Se testeó getAuthErrorMessage (lógica pura de traducción de errores) y el componente Login (con mocks de authService, cubriendo tanto el caso de éxito como el caso de credenciales incorrectas).

## Uso de IA en el desarrollo

Se utilizó Claude (Anthropic) como asistente durante todo el desarrollo, en modalidad guiada paso a paso: se pedía la explicación conceptual de cada hito antes de escribir código, y la implementación se hacía revisando y ejecutando cada bloque manualmente.

Prompts principales utilizados:
- Explicación de cada hito de la guía del PI4 antes de implementarlo (setup, Firebase, auth, rutas protegidas, modelo de datos, CRUD en tiempo real, AWS SES + serverless, testing, deploy).
- Diagnóstico de errores concretos durante el desarrollo (índices de Firestore faltantes, problemas de capitalización de archivos entre Windows y Linux, configuración de variables de entorno en Vercel).

Cómo influyeron en la implementación:
- Las explicaciones previas a cada bloque de código ayudaron a entender el porqué de cada decisión antes de escribirla, en vez de copiar código sin comprenderlo.
- Los errores reales encontrados durante el proceso (índice de Firestore, capitalización de archivos en el build de producción, configuración del entorno Development en Vercel) se resolvieron identificando la causa raíz en cada caso.

Decisiones tomadas a partir de las respuestas generadas:
- Se decidió desplegar en Vercel antes de terminar el pulido visual (CSS), siguiendo la recomendación de la guía de "desplegar temprano" — esto permitió detectar y corregir a tiempo el problema de capitalización de archivos entre Windows y Linux, que no se hubiera manifestado en desarrollo local.
- Se priorizó un set acotado de tests (con mocks de Firebase) en vez de cobertura extensa, dado el tiempo disponible, enfocándose en comportamiento crítico (traducción de errores de auth) en vez de tests superficiales de renderizado.
# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Variables de entorno y credenciales

- Usa archivos `.env.local` para desarrollo y no los subas a Git: ya están ignorados por `.gitignore`.
- Las variables del frontend deben empezar con `VITE_` (por ejemplo `VITE_FIREBASE_API_KEY`). Ten en cuenta que se incrustan en el bundle y no son secretas.
- Para Firebase Cloud Functions usa secretos gestionados en lugar de hardcodear claves.

### Configuración rápida

1. Copia `.env.example` a `.env.local` y completa los valores públicos de Firebase.
2. Añade `VITE_FIREBASE_VAPID_KEY` si usas notificaciones web.
3. En producción (Vercel), define variables de entorno en el panel de proyecto o con CLI.

### Vercel (producción)

Puedes definir variables de entorno con la CLI:

```
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_AUTH_DOMAIN production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_STORAGE_BUCKET production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add VITE_FIREBASE_APP_ID production
vercel env add VITE_FIREBASE_VAPID_KEY production
```

### Firebase Functions (backend)

Para secretos del backend, usa Google Secret Manager con Firebase:

```
firebase functions:secrets:set MY_SECRET
# En código (Functions SDK v4+)
// const { defineSecret } = require('firebase-functions/params');
// const MY_SECRET = defineSecret('MY_SECRET');
```

Evita subir claves sensibles al repositorio. Si alguna clave se expuso, rota ese secreto en el proveedor correspondiente.

# 🚀 Desplegar en Vercel

## Paso 1: Crear repositorio en GitHub

```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "Initial commit"
```

Luego:
1. Ve a https://github.com/new
2. Crea un nuevo repositorio (ej: `vk-vikingas-web`)
3. Sigue las instrucciones para conectar tu proyecto local

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/vk-vikingas-web.git
git push -u origin main
```

## Paso 2: Desplegar en Vercel

1. Ve a https://vercel.com
2. Haz login con GitHub
3. Click en "New Project"
4. Importa tu repositorio `vk-vikingas-web`
5. Vercel detectará automáticamente que es un proyecto Vite
6. Haz click en "Deploy"

## Paso 3: Tu sitio estará en vivo 🎉

- Frontend: `https://vk-vikingas-web.vercel.app`
- API: `https://vk-vikingas-web.vercel.app/api/competencias`

El servidor se actualizará automáticamente cada vez que hagas `git push`.

---

## Para desarrollo local:

Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm run dev
```

Accede a `http://localhost:5173/competencias`

## Variables de entorno

- **`.env.local`** → Para desarrollo (usa localhost:3001)
- **`.env.production`** → Para producción en Vercel

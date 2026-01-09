# Firebase Firestore Rules

Estas son las reglas de seguridad recomendadas para Firestore. Cópialas en tu consola de Firebase.

## Reglas para Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Permitir lectura pública de sliderHome (para mostrar en home)
    match /sliderHome/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Galerias - lectura pública, escritura autenticada
    match /galerias/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Eventos - lectura pública, escritura autenticada
    match /eventos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Eventos especiales - lectura pública, escritura autenticada
    match /eventosEspeciales/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Equipos - lectura pública, escritura autenticada
    match /equipos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Jugadoras - lectura pública, escritura autenticada
    match /jugadoras/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Estadisticas - lectura pública, escritura autenticada
    match /estadisticas/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Usuarios - solo lectura de su propio documento
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Denegar acceso a todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## ¿Cómo aplicar estas reglas?

### En Firebase Console:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "loginvk-955b2"
3. En el menú izquierdo: **Firestore Database**
4. Haz clic en la pestaña **Rules** (Reglas)
5. Reemplaza todo el contenido con las reglas de arriba
6. Haz clic en **Publish** (Publicar)

### Confirmación:

Si ves un ✅ verde con "Cloud Firestore rules updated successfully", ¡está hecho!

---

## Explicación de las reglas:

| Colección | Lectura | Escritura | Eliminación |
|-----------|---------|-----------|------------|
| **sliderHome** | 🌐 Pública | 🔒 Autenticado | 🔒 Autenticado |
| **galerias** | 🌐 Pública | 🔒 Autenticado | 🔒 Autenticado |
| **eventos** | 🌐 Pública | 🔒 Autenticado | 🔒 Autenticado |
| **eventosEspeciales** | 🌐 Pública | 🔒 Autenticado | 🔒 Autenticado |
| **equipos** | 🌐 Pública | 🔒 Autenticado | 🔒 Autenticado |
| **jugadoras** | 🌐 Pública | 🔒 Autenticado | 🔒 Autenticado |
| **estadisticas** | 🌐 Pública | 🔒 Autenticado | 🔒 Autenticado |
| **users** | 🔒 Solo propio | 🔒 Solo propio | 🔒 Solo propio |

---

## Seguridad

✅ **Lectura pública** - Los usuarios no autenticados pueden ver el contenido (home, galería, eventos)
🔒 **Escritura protegida** - Solo usuarios logueados pueden agregar/editar contenido
🔐 **Usuarios privados** - Solo pueden ver/editar su propio documento de usuario

---

## Notas importantes

- Estas reglas son **permisivas con lectura pública** porque el sitio es informativo
- Si necesitas más restricciones (ej: solo admin puede escribir), avísale al equipo técnico
- Los cambios tardan 1-2 minutos en aplicarse completamente

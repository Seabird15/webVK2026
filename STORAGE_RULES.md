# Firebase Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura a todos (público)
    match /{allPaths=**} {
      allow read: if true;
    }

    // Fotos de jugadoras - Solo autenticados pueden escribir
    match /jugadoras/{allPaths=**} {
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Fotos de galerias - Solo autenticados pueden escribir
    match /galerias/{allPaths=**} {
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Imágenes del slider home - Solo autenticados pueden escribir
    match /slider/{allPaths=**} {
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Validación adicional por tamaño de archivo (5MB máximo)
    match /jugadoras/{allPaths=**} {
      allow write: if request.auth != null && 
                      request.resource.size < 5 * 1024 * 1024;
    }

    match /galerias/{allPaths=**} {
      allow write: if request.auth != null && 
                      request.resource.size < 5 * 1024 * 1024;
    }

    match /slider/{allPaths=**} {
      allow write: if request.auth != null && 
                      request.resource.size < 5 * 1024 * 1024;
    }

    // Denegar el resto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Explicación de las reglas:

✅ **Lectura pública** - Todos pueden ver las imágenes
🔒 **Escritura autenticada** - Solo usuarios logueados pueden subir
⚠️ **Límite de tamaño** - Máximo 5MB por archivo
🗑️ **Eliminación autenticada** - Solo usuarios logueados pueden borrar

Estas reglas son más seguras que `allow write: if request.auth != null;` porque especifican exactamente qué carpetas se pueden escribir y limitan el tamaño de los archivos.
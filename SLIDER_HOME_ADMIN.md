# Slider Home Administrable - Documentación

## ✅ Cambios Implementados

Se ha convertido el slider de la página home en un elemento **completamente administrable** desde el panel de administración.

---

## 📋 Componentes Nuevos

### 1. **sliderHome.js** (Firebase Module)
Ubicación: `src/firebase/sliderHome.js`

Funciones disponibles:
- `obtenerSliderHome()` - Obtiene todas las imágenes ordenadas
- `subirImagenSlider(archivo, orden)` - Sube una imagen a Firebase Storage
- `actualizarOrdenSlider(imagenes)` - Reordena las imágenes
- `eliminarImagenSlider(imagenId, nombreArchivo)` - Elimina una imagen

### 2. **GestionarSliderHome.vue** (Admin Component)
Ubicación: `src/components/GestionarSliderHome.vue`

Características:
- 📤 Subida de nuevas imágenes
- 👀 Vista previa del slider
- ⬆️⬇️ Reordenamiento de imágenes
- 🗑️ Eliminación de imágenes
- 📊 Lista ordenada de imágenes actuales
- 💡 Recomendaciones técnicas integradas

---

## 🔧 Cambios en Archivos Existentes

### SliderHome.vue
**Cambios:**
- Ahora obtiene las imágenes de Firebase Firestore (colección `sliderHome`)
- Las imágenes se cargan dinámicamente al montar el componente
- Incluye imágenes de respaldo en caso de error

**Antes:**
```javascript
const images = ref([
  'https://url1.webp',
  'https://url2.webp',
  'https://url3.webp'
]);
```

**Ahora:**
```javascript
const images = ref([]);

onMounted(async () => {
  try {
    const imagenesCargadas = await obtenerSliderHome();
    images.value = imagenesCargadas.map(img => img.url);
  } catch (error) {
    // Imágenes de respaldo
  }
});
```

### Admin.vue
**Cambios:**
- Agregada nueva tab "Slider Home" (primera posición)
- Importado componente `GestionarSliderHome`
- Agregada sección de contenido para el slider

### STORAGE_RULES.md
**Cambios:**
- Agregadas reglas de seguridad para la carpeta `/slider/`
- Validación de tamaño máximo de 5MB
- Solo usuarios autenticados pueden escribir/eliminar

---

## 🗄️ Estructura Firebase Requerida

### Colección: `sliderHome`
```javascript
{
  id: "documento_id",
  url: "https://firebasestorage.googleapis.com/...",
  orden: 0,
  nombreArchivo: "slider/1705000000000_imagen.webp",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Índice recomendado:**
- Campo: `orden`
- Dirección: Ascendente

---

## 🚀 Cómo Usar

### Para Administradores

1. **Acceder al panel:** Login → Panel de Administración
2. **Ir a Slider Home:** Click en tab "Slider Home"
3. **Agregar imagen:**
   - Click en "Seleccionar imagen"
   - Elige archivo (JPG, PNG, WebP recomendado)
   - Click en "Subir Imagen"

4. **Reordenar:**
   - Usa botones ⬆️ y ⬇️ para cambiar orden
   - Los cambios se guardan automáticamente

5. **Eliminar:**
   - Click en "Eliminar" (🗑️)
   - Confirma la acción

### Para Usuarios (Mostración)

El slider carga automáticamente las imágenes desde Firebase y las muestra en la página home con:
- Navegación con botones
- Indicadores de posición clickeables
- Soporte para swipe en móvil
- Vista previa de miniatura con orden actual

---

## 📸 Recomendaciones de Imágenes

### Tamaño
- **Ancho:** 1920px (mínimo 1024px)
- **Alto:** 600px (relación 16:5)
- **Resolución:** 72-96 DPI para web

### Formato
- ✅ **Recomendado:** WebP (25-35% más pequeño)
- ✅ **Alternativa:** JPG con calidad 80-85
- ⚠️ PNG solo si necesita transparencia

### Peso
- Máximo recomendado: 300-500KB
- Sistema permite: hasta 5MB

### Conversión a WebP
Ver documento: `CONVERSION_WEBP.md`

Herramientas recomendadas:
- [Convertio.co](https://convertio.co/es/jpg-webp/) (online, gratis)
- [GIMP](https://www.gimp.org/download/) (desktop, gratis)
- [ImageMagick](https://imagemagick.org/) (CLI, gratis)

---

## 🔐 Seguridad

### Permisos
- ✅ Solo usuarios autenticados pueden subir/eliminar
- ✅ Públicos pueden ver las imágenes
- ✅ Validación de tamaño de archivo (máx 5MB)

### Almacenamiento
- Imágenes se guardan en: `gs://bucket/slider/`
- Metadatos en Firestore: colección `sliderHome`
- URLs de descarga están optimizadas para caché

---

## 🛠️ Troubleshooting

### Las imágenes no cargan
1. Verifica que la colección `sliderHome` existe en Firestore
2. Comprueba que hay documentos con campo `url` y `orden`
3. Revisa la consola del navegador para errores

### Error "Permission denied" al subir
1. Verifica estar logueado
2. Revisa que las Storage Rules estén actualizadas
3. Comprueba el límite de 5MB

### Las imágenes suben pero no aparecen
1. Recarga la página (F5)
2. Verifica que el documento tiene campo `url` con URL válida
3. Comprueba el campo `orden` esté numérico

---

## 📝 Notas Técnicas

### Orden de Imágenes
- Las imágenes se ordenan por campo `orden` (0, 1, 2, etc.)
- Al reordenar, se actualiza automáticamente en Firestore
- El componente mantiene el orden en tiempo real

### Caché
- Las URLs de Storage incluyen parámetros de caché
- Las imágenes se cachean por defecto en el navegador
- Cambios se ven instantáneamente en la vista previa

### Performance
- Las imágenes se cargan lazy (bajo demanda)
- El slider usa transiciones CSS3 (hardware accelerated)
- No hay límite técnico de imágenes (recomendado 3-7)

---

## 🔗 Archivos Relacionados

- `src/components/SliderHome.vue` - Componente de visualización
- `src/firebase/sliderHome.js` - Módulo de datos
- `src/components/GestionarSliderHome.vue` - Panel de administración
- `src/Pages/Admin.vue` - Panel principal
- `STORAGE_RULES.md` - Reglas de seguridad
- `CONVERSION_WEBP.md` - Guía de conversión de imágenes

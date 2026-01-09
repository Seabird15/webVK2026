# 📦 Componente Loader Global

## 🎯 Descripción

El componente `Loader` es un spinner global que funciona en todas las páginas con carga dinámica. Utiliza el **logo de Vikingas** (assets/logoVk.png) con un **efecto de pulsación lenta** para proporcionar retroalimentación visual mientras se cargan datos asincronamente.

## ✨ Características

- ✅ Logo de Vikingas como loader
- ✅ Efecto de pulsación suave (2 segundos)
- ✅ Overlay con backdrop blur
- ✅ Mensajes personalizados
- ✅ Transiciones suaves (fade in/out)
- ✅ Responsive (adapta tamaño en móvil y desktop)
- ✅ Ya implementado en todas las páginas principales

## � Páginas con Loader Implementado

✅ **Equipo.vue** - Carga de equipos (Ascenso, Escuela, Futsal)
✅ **Fotos.vue** - Carga de galerías
✅ **Calendario.vue** - Carga de eventos del mes

### Importar en un componente

```javascript
import { useLoader } from '../composables/useLoader.js';

const { show, hide, toggle } = useLoader();
```

### Métodos disponibles

#### `show(mensaje)`
Muestra el loader con un mensaje opcional.

```javascript
const { show } = useLoader();

// Con mensaje
show('Cargando jugadoras...');

// Sin mensaje (solo spinner)
show();
```

#### `hide()`
Oculta el loader.

```javascript
const { hide } = useLoader();

hide();
```

#### `toggle(mensaje)`
Alterna el estado del loader.

```javascript
const { toggle } = useLoader();

toggle('Procesando...');
```

#### Propiedades reactivas

```javascript
const { isLoading, loadingMessage } = useLoader();

// isLoading: boolean - indica si el loader está visible
// loadingMessage: string - mensaje mostrado en el loader
```

## 📝 Ejemplos prácticos

### Ejemplo 1: Carga de datos en onMounted

```vue
<script setup>
import { onMounted } from 'vue';
import { useLoader } from '../composables/useLoader.js';
import { obtenerJugadoras } from '../firebase/jugadoras.js';

const { show, hide } = useLoader();
const jugadoras = ref([]);

onMounted(async () => {
    try {
        show('Cargando jugadoras...');
        jugadoras.value = await obtenerJugadoras();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar las jugadoras');
    } finally {
        hide();
    }
});
</script>
```

### Ejemplo 2: Guardar datos

```vue
<script setup>
import { useLoader } from '../composables/useLoader.js';

const { show, hide } = useLoader();

const guardarDatos = async () => {
    try {
        show('Guardando cambios...');
        
        // Tu lógica de guardado
        await actualizarBaseDatos(datos);
        
        alert('✓ Guardado exitosamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    } finally {
        hide();
    }
};
</script>
```

### Ejemplo 3: Operación con múltiples pasos

```vue
<script setup>
import { useLoader } from '../composables/useLoader.js';

const { show, hide } = useLoader();

const procesarMultiples = async () => {
    try {
        show('Validando datos...');
        // Paso 1
        
        show('Subiendo archivos...');
        // Paso 2
        
        show('Actualizando base de datos...');
        // Paso 3
        
        hide();
        alert('✓ Proceso completado');
    } catch (error) {
        hide();
        alert('Error: ' + error.message);
    }
};
</script>
```

## 🎨 Características

✅ **Global**: Funciona en todas las páginas sin necesidad de replicar el componente
✅ **Reactivo**: Usa Vue 3 Composition API
✅ **Animado**: Spinner con animación suave
✅ **Mensajes**: Soporta mensajes personalizados
✅ **Backdrop**: Desenfoque de fondo con overlay semi-transparente
✅ **Transiciones**: Fade in/out suave

## 📐 Estilos

El componente usa:
- **Color primario**: Spinner en color primario (#00ECB1)
- **Fondo**: Overlay oscuro semi-transparente con backdrop blur
- **Z-index**: 50 (sobre todo el contenido excepto modales)
- **Animación**: Rotación continua a 1s

## ⚙️ Personalización

### Cambiar velocidad de animación

En `src/components/Loader.vue`, modificar `style scoped`:

```css
.animate-spin {
    animation: spin 0.5s linear infinite; /* Más rápido */
}
```

### Cambiar tamaño del spinner

```vue
<div class="w-24 h-24"> <!-- Cambiar w-16 h-16 a w-24 h-24 -->
```

### Cambiar mensaje por defecto

En `useLoader()`:

```javascript
const show = (message = 'Tu mensaje personalizado') => {
    // ...
};
```

## 🎨 Efecto de Pulsación

La animación de pulsación tiene las siguientes características:

```css
@keyframes pulse-slow {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.05);
    }
}

.pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

- **Duración**: 2 segundos
- **Efecto**: Cambio suave de opacidad (1 → 0.7 → 1) y escala (1 → 1.05 → 1)
- **Curva**: cubic-bezier para transición suave
- **Repetición**: Infinita mientras se carga

Puedes crear un helper para operaciones comunes:

```javascript
// src/composables/useLoaderAsync.js
import { useLoader } from './useLoader.js';

export function useLoaderAsync() {
    const { show, hide } = useLoader();

    const loadAsync = async (operation, message = 'Cargando...') => {
        try {
            show(message);
            const result = await operation();
            return result;
        } finally {
            hide();
        }
    };

    return { loadAsync };
}
```

Luego usar:

```javascript
const { loadAsync } = useLoaderAsync();

onMounted(() => {
    jugadoras.value = await loadAsync(
        () => obtenerJugadoras(),
        'Cargando jugadoras...'
    );
});
```

## 📦 Archivos

- **Composable**: `src/composables/useLoader.js`
- **Componente**: `src/components/Loader.vue`
- **Integrado en**: `src/App.vue`

---

**Estado**: ✅ Listo para usar en todas las páginas

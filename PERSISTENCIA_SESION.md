# 🔐 Persistencia de Sesión - Guía Técnica

## ¿Cómo Funciona?

Cuando una jugadora inicia sesión y recarga la página, la sesión debe mantenerse automáticamente.

### El Flujo

```
1. Jugadora hace login en /login-jugadora
   ├─ Firebase Auth autentica
   └─ Se guarda en localStorage de navegador (automático)

2. onAuthStateChanged se dispara
   ├─ Detecta usuario en Auth
   ├─ Carga datos de Firestore
   └─ Actualiza jugadoraAuthUser.value

3. Jugadora navega a página protegida
   ├─ Guard del router checkea jugadoraAuthUser.value
   └─ Permite acceso ✓

4. Jugadora hace refresh (F5)
   ├─ Firebase Auth restaura sesión (desde localStorage)
   ├─ onAuthStateChanged se dispara nuevamente
   ├─ Carga datos nuevamente
   ├─ Guard verifica jugadoraAuthUser.value
   └─ Permite acceso ✓ (sin logout)
```

---

## Cambios Implementados

### 1. Flag `authReady`
```javascript
export const authReady = ref(false);

// En onAuthStateChanged:
authReady.value = true; // Se marca como true cuando Auth está listo
```

**Propósito:** Indicar que Firebase Auth ha completado su inicialización.

### 2. Guard Mejorado del Router
```javascript
router.beforeEach((to, from, next) => {
  if (requiresJugadora) {
    // Esperar a que Auth esté listo
    if (!authReady.value) {
      console.log('Esperando a que Auth esté listo...');
      setTimeout(() => {
        router.beforeEach(arguments.callee);
      }, 100);
      return;
    }
    
    // Luego verificar autenticación
    if (jugadoraAuthUser.value) {
      next();
    } else {
      next('/login-jugadora');
    }
  }
});
```

**Propósito:** No dejar pasar al usuario hasta que Firebase Auth esté listo.

### 3. onMounted en Componentes Protegidos
```javascript
onMounted(() => {
  if (!jugadoraAuthUser.value) {
    router.push('/login-jugadora');
  }
});
```

**Propósito:** Doble verificación cuando el componente se monta.

---

## 🧪 Cómo Probar

### Paso 1: Login Normal
```
1. Ve a /login-jugadora
2. Inicia sesión
3. Deberías ir a /completar-perfil o /entrenamientos
```

### Paso 2: Recarga y Persistencia
```
1. Una vez dentro (en /entrenamientos)
2. Presiona F5 (refresh)
3. Deberías MANTENER LA SESIÓN
   ✓ No te redirige a /login-jugadora
   ✓ Ves la misma página

Logs esperados:
  "onAuthStateChanged disparado, usuario: {uid}"
  "Datos de jugadora cargados: {...}"
```

### Paso 3: Cierre de Navegador
```
1. Cierra el navegador completamente
2. Reabre el sitio
3. Ve a /entrenamientos
4. Deberías VER SESIÓN RESTAURADA
   ✓ No necesitas hacer login de nuevo
   ✓ Firebase restauró la sesión desde localStorage

Logs esperados:
  "Esperando a que Auth esté listo..."
  "onAuthStateChanged disparado, usuario: {uid}"
  "Jugadora autenticada, permitiendo acceso"
```

---

## 🔄 Ciclo Completo

### Primera Carga (Sin Sesión)
```
App monta
  ├─ onAuthStateChanged inicia
  ├─ jugadoraAuthUser.value = null
  ├─ authReady.value = true
  └─ Si accede a /entrenamientos → Redirige a /login-jugadora
```

### Login
```
Usuario hace login en /login-jugadora
  ├─ signInWithEmailAndPassword
  ├─ Firebase guarda en Auth (y localStorage)
  ├─ onAuthStateChanged se dispara
  ├─ jugadoraAuthUser.value = user ✓
  ├─ Carga datos de Firestore
  └─ Redirige a /completar-perfil o /entrenamientos
```

### Refresh (F5)
```
Usuario presiona F5
  ├─ App reinicia
  ├─ onAuthStateChanged se dispara
  │  ├─ Firebase detecta sesión en localStorage
  │  ├─ Restaura autenticación
  │  └─ jugadoraAuthUser.value = user ✓
  ├─ Guard del router verifica authReady
  │  └─ Espera a que sea true
  ├─ Guard verifica jugadoraAuthUser
  │  └─ Permite acceso ✓
  └─ Usuario ve la misma página
```

### Logout
```
Usuario presiona "Cerrar Sesión"
  ├─ signOut(auth)
  ├─ Firebase borra sesión
  ├─ localStorage se limpia
  ├─ onAuthStateChanged se dispara
  │  └─ jugadoraAuthUser.value = null
  ├─ Redirige a /login-jugadora
  └─ Si presiona F5 → Va a login (sin sesión)
```

---

## 🐛 Troubleshooting

### Se desconecta al recargar
**Causas:**
- onAuthStateChanged no se disparó
- Firebase no tiene sesión guardada

**Solución:**
```javascript
// Verificar en consola:
console.log('authReady:', authReady.value);
console.log('jugadoraAuthUser:', jugadoraAuthUser.value);
console.log('Auth usuario:', auth.currentUser);
```

### Guard redirige incorrectamente
**Causas:**
- Guard se ejecutó antes de que authReady sea true
- onAuthStateChanged aún cargando datos

**Solución:**
- El nuevo guard espera a authReady
- Si sigue pasando, aumentar timeout de 100ms a 200ms

### Datos desactualizados después de refresh
**Causas:**
- Datos en Firestore cambiaron
- Cache de navegador

**Solución:**
```javascript
// Forzar recarga:
const data = await fetchJugadoraData(uid, 'jugadoraRegistro');
```

---

## 📊 Estado Esperado

### Después de Login
```javascript
jugadoraAuthUser.value = {
  uid: "kWEjrEMDQnWVnD9463Wk75Qiuf62",
  email: "jugadora@example.com"
}

jugadoraData.value = {
  id: "kWEjrEMDQnWVnD9463Wk75Qiuf62",
  nombre: "María",
  apellido: "García",
  equipo: "ascenso",
  dorsal: 7,
  posicion: "Portera",
  perfilCompleto: true
}

authReady.value = true
```

### Después de Refresh
Mismo estado que arriba.

### Después de Logout
```javascript
jugadoraAuthUser.value = null
jugadoraData.value = null
authReady.value = true
```

---

## 🔑 Puntos Clave

1. **Firebase Auth maneja la sesión automáticamente**
   - Se guarda en localStorage
   - Se restaura al recargar

2. **onAuthStateChanged se dispara al cargar la app**
   - En primer cargar: usuario = null
   - Si hay sesión: usuario = object

3. **Guard del router debe esperar a authReady**
   - No confiar en jugadoraAuthUser.value solo
   - Esperar a que onAuthStateChanged complete

4. **Datos en Firestore se cargan después de Auth**
   - onAuthStateChanged carga datos cuando Auth está listo
   - Si no existen, crea estado vacío (perfil incompleto)

---

## ✅ Checklist de Validación

- ✅ Logout borra sesión completamente
- ✅ Refresh mantiene sesión
- ✅ Cerrar navegador mantiene sesión (hasta cookies expire)
- ✅ Guard espera a authReady antes de verificar
- ✅ Datos se cargan correctamente después de refresh
- ✅ Estado es consistente entre cargas

---

**Última actualización:** 2024
**Versión:** 1.0 - Con persistencia de sesión

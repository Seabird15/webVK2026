# 🔐 Solucionar Errores de Login - Jugadoras

## Error: "Email o contraseña incorrectos" (auth/invalid-credential)

### ¿Qué significa?
Firebase no pudo autenticar el usuario. Las causas principales son:
- ❌ La contraseña es incorrecta
- ❌ El email no está registrado en Firebase Auth
- ❌ El email está registrado con una contraseña diferente

### ¿Cómo solucionarlo?

#### Opción 1: Recuperar Contraseña (Recomendado)
Si olvidaste la contraseña:

1. En la página `/login-jugadora`
2. Verifica que el email sea correcto
3. Si no recuerdas la contraseña:
   - **PRÓXIMAMENTE:** Habrá un link "¿Olvidaste tu contraseña?"
   - Por ahora contacta a admin

#### Opción 2: Registrarse de Nuevo
Si aún no estás aprobado:

1. Ve a `/solicitud-acceso`
2. Usa el mismo email
3. Crea una NUEVA contraseña
4. **IMPORTANTE:** Asegúrate de que sea diferente a la anterior
5. Espera aprobación del admin
6. Intenta login con la nueva contraseña

#### Opción 3: Admin Reset (Para Admin)
Si eres admin y necesitas resetear una jugadora:

1. Ve a `/admin`
2. Tab "Jugadoras" (próximamente)
3. Busca la jugadora
4. Opción "Resetear contraseña"
5. Ella recibirá email para cambiar contraseña

---

## Flujo Correcto de Login

```
Usuario va a /login-jugadora
├─ Ingresa email: jugadora@example.com
├─ Ingresa contraseña: la misma que usó en /solicitud-acceso
│
└─ Firebase valida:
   ├─ ¿Email existe en Auth? 
   │  └─ NO → Error "Email o contraseña incorrectos"
   │  └─ SÍ → Continúa
   │
   ├─ ¿Contraseña coincide?
   │  └─ NO → Error "Email o contraseña incorrectos"
   │  └─ SÍ → Continúa
   │
   ├─ ¿Está aprobada en jugadorasLogin?
   │  └─ NO → Error "Tu solicitud aún está pendiente"
   │  └─ SÍ → Continúa
   │
   ├─ ¿Tiene perfil completo (jugadoraRegistro)?
   │  └─ NO → Redirige a /completar-perfil
   │  └─ SÍ → Redirige a /entrenamientos
```

---

## Verificar en Firebase Console

Si el error persiste:

### 1. Verificar que existe en Auth
```
Firebase Console
  → Authentication
  → Users
  → Buscar por email
  
¿Existe? → SI/NO
```

### 2. Verificar que está en jugadorasLogin
```
Firebase Console
  → Firestore
  → Colección: jugadorasLogin
  → Documento: {uid}
  
¿Existe y estado = "aprobada"? → SI/NO
```

### 3. Verificar registros en Firestore
```
Collections:
├── jugadorasLogin/{uid}
│   ├── email: "jugadora@example.com"
│   ├── estado: "aprobada" ← DEBE SER ESTO
│   └── ...
```

---

## Tabla de Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Email o contraseña incorrectos" | Credenciales inválidas | Verifica que escribas bien email y contraseña |
| "Tu solicitud aún está pendiente" | Estado en jugadorasLogin es "pendiente" | Espera a que admin apruebe |
| "Tu solicitud fue rechazada" | Admin rechazó la solicitud | Contacta a admin para saber por qué |
| "Solicitud de acceso no encontrada" | Documento no existe en jugadorasLogin | Registrate de nuevo en /solicitud-acceso |

---

## Debugging - Pasos para Reportar Error

Si el error persiste, para reportar efectivamente:

1. **Abre la consola** (F12 → Console)
2. **Intenta login**
3. **Copia todos los logs** que aparezcan
4. **Verifica en Firebase Console**:
   - ¿Existe el usuario en Authentication?
   - ¿Está en jugadorasLogin?
   - ¿Cuál es el estado?
5. **Reporta con esta información**

---

## Logs Esperados (Exitosos)

```
Intentando login con: danielalizama.a@gmail.com
Usuario autenticado en Auth: kWEjrEMDQnWVnD9463Wk75Qiuf62
Estado en jugadorasLogin: aprobada
Perfil aún no completado. Usuario puede completarlo en /completar-perfil
Login exitoso
Perfil incompleto, redirigiendo a completar-perfil
```

---

## Próximas Funcionalidades

- ✅ Mejor manejo de errores (ya está)
- ⏳ Link "¿Olvidaste tu contraseña?"
- ⏳ Reset de contraseña por email
- ⏳ Admin panel para resetear usuarios

---

**Última actualización:** 2024
**Versión:** 1.0

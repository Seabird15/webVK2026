# Solución: Sitio no carga en móvil

## Diagnóstico Rápido

El problema más común es que **el DNS aún no se ha propagado completamente** en las redes móviles.

### Pasos para resolver:

#### 1. **Vacía el caché del navegador móvil**

**Android (Chrome):**
- Abre Chrome
- Menú ⋮ → **Configuración**
- **Privacidad y seguridad** → **Borrar datos de navegación**
- ✅ Cookies e imágenes en caché
- ✅ Archivos almacenados en caché
- Selecciona "Todos los tiempos"
- Toca **Borrar datos**

**iPhone (Safari):**
- Configuración → Safari
- **Historial y datos de sitios web**
- Toca **Editar** → **Borrar todo**
- O en Settings → General → iPhone Storage → Safari → Offlines Reading List

#### 2. **Prueba en navegador diferente**

**Android:**
- Prueba con **Firefox** en lugar de Chrome
- O usa **incógnito/privado** (evita caché)

**iPhone:**
- Prueba con **Firefox** o **Chrome**
- O usa modo privado de Safari

#### 3. **Fuerza la actualización de DNS móvil**

**Android:**
```
1. Configuración → Sistema → Idioma e entrada
2. O Configuración → Red e Internet
3. Desactiva WiFi durante 30 segundos
4. Activa WiFi de nuevo
(Esto fuerza actualización del DNS)
```

**iPhone:**
```
1. Configuración → WiFi
2. Toca tu red
3. Olvida la red
4. Conéctate de nuevo
(También prueba con datos móviles)
```

#### 4. **Prueba con datos móviles (no WiFi)**

A veces el problema es el WiFi/router. Intenta:
- Desactiva WiFi
- Usa datos móviles (4G/5G)
- Si funciona, el problema es el DNS del router

#### 5. **Verifica el certificado SSL**

En el móvil:
```
1. Abre clubdeportivovikingas.cl
2. Toca el candado (esquina superior)
3. Verifica que el certificado sea válido
4. Si dice "No seguro" o error, hay problema con SSL
```

## Verificación Técnica

**En PC, abre terminal y ejecuta:**

```powershell
# Verifica que el DNS resuelve correctamente
nslookup clubdeportivovikingas.cl

# Deberías ver:
# Address: 199.36.158.100 (o 199.36.158.101)
```

**En móvil (Android):**

Descarga **DNS Checker** desde Play Store para verificar resolución DNS.

## Si aún no funciona

1. **Espera 24-48 horas más** - DNS puede tardar tiempo en propagarse globalmente
2. **Verifica Cloudflare:**
   - Ve a Dashboard → Tu dominio → DNS
   - Confirma que los registros A estén presentes:
     - ✅ 199.36.158.100
     - ✅ 199.36.158.101
   - Verifica que el "Proxy status" sea **DNS only** (gris)

3. **Reconstruye y redeploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Checklist Móvil

- [ ] Vacié caché navegador
- [ ] Probé en navegador diferente
- [ ] Probé en modo incógnito/privado
- [ ] Desconecté/reconecté WiFi
- [ ] Probé con datos móviles
- [ ] Certificado SSL aparece válido (candado verde)

Si aún no funciona después de estos pasos, puede ser un problema de ISP/operador móvil que no ha actualizado DNS. En ese caso solo queda esperar o cambiar a otro DNS (1.1.1.1 o 8.8.8.8).

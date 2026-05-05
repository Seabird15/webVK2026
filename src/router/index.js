import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import Equipo from '../Pages/Equipo.vue';
import Login from '../Pages/Login.vue';
import Admin from '../Pages/Admin.vue';
import { authUser, userRole, authReady } from '../firebase/auth';
import { jugadoraAuthUser, authReady as jugadoraAuthReady, logoutJugadora, tieneAccesoAprobadoJugadora } from '../firebase/jugadorasAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { trackPageView } from '../composables/useAnalytics';

const SITE_NAME = 'CD Vikingas';
const SITE_URL = 'https://clubdeportivovikingas.cl';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'CD Vikingas — Fútbol Femenino en Santiago | Desde 2019',
      description: 'Club deportivo de fútbol femenino en Santiago de Chile. Creado por y para mujeres desde 2019. Competencias, equipo, galería y más.'
    }
  },
  {
    path: '/equipo',
    name: 'Equipo',
    component: Equipo,
    meta: {
      title: 'Nuestro Equipo — CD Vikingas',
      description: 'Conoce a las jugadoras de CD Vikingas. Equipos de Serie B Ascenso, Serie C, Escuela Formativa y Futsal.'
    }
  },
  {
    path: '/historia',
    name: 'Historia',
    component: () => import('../Pages/Historia.vue'),
    meta: {
      title: 'Nuestra Historia — CD Vikingas | Desde 2019',
      description: 'La historia de Vikingas: un club de fútbol femenino nacido en Santiago en 2019. Creado por y para mujeres, con garra y sentido de pertenencia.'
    }
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: () => import('../Pages/Calendario.vue'),
    meta: {
      title: 'Calendario de Partidos — CD Vikingas',
      description: 'Calendario de partidos y entrenamientos de CD Vikingas. Revisa las próximas fechas del fútbol femenino en Santiago.'
    }
  },
  {
    path: '/indumentaria',
    alias: '/indumentarias',
    name: 'Indumentaria',
    component: () => import('../Pages/Indumentaria.vue'),
    meta: {
      title: 'Indumentaria Oficial — CD Vikingas',
      description: 'Camisetas, buzos y accesorios oficiales de CD Vikingas. Viste los colores del club de fútbol femenino.'
    }
  },
  {
    path: '/fotos',
    name: 'Fotos',
    component: () => import('../Pages/Fotos.vue'),
    meta: {
      title: 'Galería de Fotos — CD Vikingas',
      description: 'Fotos de partidos, entrenamientos y eventos de CD Vikingas. La galería del fútbol femenino en Santiago.'
    }
  },
  {
    path: '/contacto',
    name: 'Contacto',
    component: () => import('../Pages/Contacto.vue'),
    meta: {
      title: 'Contacto — CD Vikingas',
      description: 'Contáctanos para sumarte a CD Vikingas, el club de fútbol femenino en Santiago. Instagram, email y más.'
    }
  },
  {
    path: '/estadisticas',
    name: 'Estadisticas',
    component: () => import('../Pages/Estadisticas.vue'),
    meta: {
      title: 'Estadísticas — CD Vikingas',
      description: 'Goleadoras, asistidoras y estadísticas completas de CD Vikingas. Datos del fútbol femenino en Santiago.'
    }
  },
  {
    path: '/competencias',
    name: 'Competencias',
    component: () => import('../Pages/Competencias.vue'),
    meta: {
      title: 'Competencias y Resultados — CD Vikingas',
      description: 'Resultados, tablas de posiciones y competencias de CD Vikingas en Liga Dobleve. Fútbol femenino competitivo en Santiago.'
    }
  },
  {
    path: '/campeonato-vikingas-4ta',
    name: 'CampeonatoVikingas4ta',
    component: () => import('../Pages/CampeonatoVikingas4ta.vue'),
    meta: {
      title: 'Campeonato Vikingas 4ta Versión — CD Vikingas',
      description: 'Campeonato relámpago solidario de Vikingas para categoría C formativa. 16 de mayo desde las 16:00 en canchas Domingo Tocornal. Pronto más información.'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Iniciar Sesión — CD Vikingas', robots: 'noindex' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, title: 'Panel Admin — CD Vikingas', robots: 'noindex' }
  },
  // Rutas de jugadoras
  {
    path: '/solicitud-acceso',
    name: 'SolicitudAcceso',
    component: () => import('../Pages/SolicitudAcceso.vue'),
    meta: { title: 'Solicitud de Acceso — CD Vikingas', robots: 'noindex' }
  },
  {
    path: '/login-jugadora',
    name: 'LoginJugadora',
    component: () => import('../Pages/LoginJugadora.vue'),
    meta: { title: 'Acceso Jugadoras — CD Vikingas', robots: 'noindex' }
  },
  {
    path: '/completar-perfil',
    name: 'CompletarPerfil',
    component: () => import('../Pages/CompletarPerfil.vue'),
    meta: { requiresJugadora: true, title: 'Completar Perfil — CD Vikingas', robots: 'noindex' }
  },
  {
    path: '/seleccionar-categoria',
    name: 'SeleccionarCategoria',
    component: () => import('../Pages/SeleccionarCategoria.vue'),
    meta: { requiresJugadora: true, title: 'Seleccionar Categoría — CD Vikingas', robots: 'noindex' }
  },
  {
    path: '/entrenamientos',
    name: 'Entrenamientos',
    component: () => import('../Pages/Entrenamientos.vue'),
    meta: { requiresJugadora: true, title: 'Entrenamientos — CD Vikingas', robots: 'noindex' }
  },
  {
    path: '/entrenamientos/:id',
    name: 'DetalleEntrenamiento',
    component: () => import('../Pages/DetalleEntrenamiento.vue'),
    meta: { requiresJugadora: true, title: 'Detalle Entrenamiento — CD Vikingas', robots: 'noindex' }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../Pages/Perfil.vue'),
    meta: { requiresJugadora: true, title: 'Mi Perfil — CD Vikingas', robots: 'noindex' }
  },
  // Ruta por defecto
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Esperar el primer evento de Firebase Auth (restauración de sesión)
const waitForAuthReady = (maxMs = 8000) => {
  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, maxMs);

    const unsubscribe = onAuthStateChanged(auth, () => {
      if (!resolved) {
        clearTimeout(timeout);
        resolved = true;
        unsubscribe();
        resolve();
      }
    });
  });
};

// Guard para rutas protegidas
router.beforeEach(async (to, from, next) => {
  // Esperar a que ambos estados de autenticación estén listos
  await waitForAuthReady();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresJugadora = to.matched.some(record => record.meta.requiresJugadora);

  // Rutas que requieren admin/coach
  if (requiresAuth) {
    if (authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
      next();
    } else {
      next('/login');
    }
  } 
  // Rutas que requieren jugadora
  else if (requiresJugadora) {
    // Permitir a Admin/Coach ver el detalle si viene desde el panel admin
    if (to.name === 'DetalleEntrenamiento' && to.query?.from === 'admin' && authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
      next();
      return;
    }

    if (jugadoraAuthUser.value) {
      const accesoAprobado = await tieneAccesoAprobadoJugadora(jugadoraAuthUser.value.uid);

      if (accesoAprobado) {
        next();
      } else {
        await logoutJugadora();
        next('/login-jugadora');
      }
    } else {
      next('/login-jugadora');
    }
  } 
  // Redirigir si ya está logueado
  else if (to.path === '/login' && authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
    next('/admin');
  } else if (to.path === '/login-jugadora' && jugadoraAuthUser.value) {
    const accesoAprobado = await tieneAccesoAprobadoJugadora(jugadoraAuthUser.value.uid);

    if (accesoAprobado) {
      next('/entrenamientos'); // O a la ruta que consideres principal para jugadoras
    } else {
      await logoutJugadora();
      next();
    }
  }
  // Permitir acceso a rutas públicas
  else {
    next();
  }
});

// Actualizar meta tags SEO después de cada navegación
router.afterEach((to) => {
  const meta = to.meta || {};

  // Title
  document.title = meta.title || `${to.name || 'Página'} — ${SITE_NAME}`;

  // Meta description
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) {
    descTag.setAttribute('content', meta.description || 'CD Vikingas — Club de fútbol femenino en Santiago de Chile, desde 2019.');
  }

  // Canonical
  const canonicalTag = document.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    canonicalTag.setAttribute('href', `${SITE_URL}${to.path === '/' ? '' : to.path}`);
  }

  // OG tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title || document.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.description || '');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `${SITE_URL}${to.path === '/' ? '' : to.path}`);

  // Robots meta (noindex para rutas privadas)
  let robotsTag = document.querySelector('meta[name="robots"]');
  if (robotsTag) {
    robotsTag.setAttribute('content', meta.robots || 'index, follow');
  }

  // Google Analytics
  trackPageView(to.path, document.title);
});

export default router;

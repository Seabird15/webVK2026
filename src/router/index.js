import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import Equipo from '../Pages/Equipo.vue';
import Login from '../Pages/Login.vue';
import Admin from '../Pages/Admin.vue';
import { authUser, userRole, authReady } from '../firebase/auth';
import { jugadoraAuthUser, authReady as jugadoraAuthReady } from '../firebase/jugadorasAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { trackPageView } from '../composables/useAnalytics';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/equipo',
    name: 'Equipo',
    component: Equipo
  },
  {
    path: '/historia',
    name: 'Historia',
    component: () => import('../Pages/Historia.vue')
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: () => import('../Pages/Calendario.vue')
  },
  {
    path: '/indumentaria',
    name: 'Indumentaria',
    component: () => import('../Pages/Indumentaria.vue')
  },
  {
    path: '/fotos',
    name: 'Fotos',
    component: () => import('../Pages/Fotos.vue')
  },
  {
    path: '/contacto',
    name: 'Contacto',
    component: () => import('../Pages/Contacto.vue')
  },
  {
    path: '/estadisticas',
    name: 'Estadisticas',
    component: () => import('../Pages/Estadisticas.vue')
  },
  {
    path: '/competencias',
    name: 'Competencias',
    component: () => import('../Pages/Competencias.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
  // Rutas de jugadoras
  {
    path: '/solicitud-acceso',
    name: 'SolicitudAcceso',
    component: () => import('../Pages/SolicitudAcceso.vue')
  },
  {
    path: '/login-jugadora',
    name: 'LoginJugadora',
    component: () => import('../Pages/LoginJugadora.vue')
  },
  {
    path: '/completar-perfil',
    name: 'CompletarPerfil',
    component: () => import('../Pages/CompletarPerfil.vue'),
    meta: { requiresJugadora: true }
  },
  {
    path: '/seleccionar-categoria',
    name: 'SeleccionarCategoria',
    component: () => import('../Pages/SeleccionarCategoria.vue'),
    meta: { requiresJugadora: true }
  },
  {
    path: '/entrenamientos',
    name: 'Entrenamientos',
    component: () => import('../Pages/Entrenamientos.vue'),
    meta: { requiresJugadora: true }
  },
  {
    path: '/entrenamientos/:id',
    name: 'DetalleEntrenamiento',
    component: () => import('../Pages/DetalleEntrenamiento.vue'),
    meta: { requiresJugadora: true }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../Pages/Perfil.vue'),
    meta: { requiresJugadora: true }
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
      next();
    } else {
      next('/login-jugadora');
    }
  } 
  // Redirigir si ya está logueado
  else if (to.path === '/login' && authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
    next('/admin');
  } else if (to.path === '/login-jugadora' && jugadoraAuthUser.value) {
    next('/entrenamientos'); // O a la ruta que consideres principal para jugadoras
  }
  // Permitir acceso a rutas públicas
  else {
    next();
  }
});

// Tracking de Google Analytics después de cada navegación
router.afterEach((to, from) => {
  // Usar nextTick para asegurar que el título de la página se haya actualizado
  setTimeout(() => {
    const pageTitle = document.title || to.name || 'CD VIKINGAS';
    trackPageView(to.path, pageTitle);
  }, 100);
});

export default router;

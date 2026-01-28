import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import Equipo from '../Pages/Equipo.vue';
import Login from '../Pages/Login.vue';
import Admin from '../Pages/Admin.vue';
import { authUser, userRole, authReady } from '../firebase/auth';
import { jugadoraAuthUser, authReady as jugadoraAuthReady } from '../firebase/jugadorasAuth';

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

// Guard para rutas protegidas
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresJugadora = to.matched.some(record => record.meta.requiresJugadora);
  
  if (requiresAuth) {
    // Esperar a que Firebase Auth esté listo
    let intentos = 0;
    while (!authReady.value && intentos < 50) {
      console.log('Esperando a que Admin Auth esté listo... intento', intentos + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
      intentos++;
    }
    
    if (!authReady.value) {
      console.warn('Timeout esperando Admin Auth');
    }
    
    // Verificar si está autenticado y tiene rol admin o coach
    if (authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
      next();
    } else {
      next('/login');
    }
  } else if (requiresJugadora) {
    // Esperar a que Firebase Auth esté listo
    let intentos = 0;
    while (!jugadoraAuthReady.value && intentos < 50) {
      console.log('Esperando a que Auth esté listo... intento', intentos + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
      intentos++;
    }
    
    if (!jugadoraAuthReady.value) {
      console.warn('Timeout esperando Auth, permitiendo acceso pero puede haber problemas');
    }
    
    // Ahora sí, verificar si jugadora está autenticada
    if (jugadoraAuthUser.value) {
      console.log('Jugadora autenticada, permitiendo acceso');
      next();
    } else {
      console.log('Jugadora no autenticada, redirigiendo a login');
      next('/login-jugadora');
    }
  } else if (to.path === '/login' && authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
    next('/admin');
  } else {
    next();
  }
});

export default router;

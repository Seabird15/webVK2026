import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import Equipo from '../Pages/Equipo.vue';
import Login from '../Pages/Login.vue';
import Admin from '../Pages/Admin.vue';
import { authUser, userRole } from '../firebase/auth';

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
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    // Verificar si está autenticado y tiene rol admin o coach
    if (authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
      next();
    } else {
      next('/login');
    }
  } else if (to.path === '/login' && authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
    next('/admin');
  } else {
    next();
  }
});

export default router;

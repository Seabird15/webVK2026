<template>
  <nav class="bg-primary-dark text-black">
    <!-- Frase  -->
    <div class="sticky top-0 z-50 bg-black text-white text-center py-2 px-4 text-xs md:text-sm font-semibold tracking-wider shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
"Cuando pienses en dejarlo, recuerda el porqué comenzaste"
    </div>

    <!-- navegación principal -->
    <div class="flex items-center justify-between px-4 md:px-8 py-4">
      <!-- Logo -->
      <router-link to="/" class="shrink-0 hover:opacity-80 transition-opacity">
        <img 
          :src="logoUrl" 
          :alt="brandName" 
          class="h-10 md:h-12 w-auto cursor-pointer"
        >
      </router-link>

      <!-- Links de navegación - Desktop -->
      <div class="hidden lg:flex items-center gap-8 flex-1 justify-start ml-10">
        <router-link 
          v-for="link in navLinks"
          :key="link.id"
          :to="link.path"
          class="text-black font-bold text-sm tracking-wider hover:text-black/70 transition-colors uppercase flex items-center gap-2"
        >
          <component :is="link.icon" class="w-5 h-5" />
          {{ link.label }}
        </router-link>
      </div>

     

      <div class="flex items-center gap-4">
        <!-- Links de redes sociales -->
        <div class="flex gap-3">
              <!-- Acceso Jugadora Mobile -->
        <router-link
          to="/login-jugadora"
          class="lg:hidden text-black font-bold text-xs tracking-wider hover:text-black/70 transition-colors"
          title="Acceso Jugadora"
        >
          <UserIcon class="w-6 h-6 md:w-7 md:h-7" />
        </router-link>
        
        <!-- Admin link -->
        <router-link
          to="/login"
          class="text-black font-bold text-xs tracking-wider hover:text-black/70 transition-colors"
          title="Administración"
        >
          <UserCircleIcon class="w-7 h-7" />
        </router-link>
          <!-- <a 
            href="https://wa.me/YOUR_PHONE"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            class="text-black hover:text-black/70 transition-colors"
          >
            <PhoneIcon class="w-5 h-5 md:w-6 md:h-6" />
          </a> -->
          <a 
            href="https://instagram.com/cdvikingas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="text-black my-auto hover:text-black/70 transition-colors"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>

        <!-- Botón menú mobile -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="lg:hidden flex flex-col gap-1.5 focus:outline-none cursor-pointer"
          aria-label="Menú"
        >
          <span class="w-6 h-0.5 bg-black transition-all" :class="isMenuOpen ? 'rotate-45 translate-y-2' : ''"></span>
          <span class="w-6 h-0.5 bg-black transition-all" :class="isMenuOpen ? 'opacity-0' : ''"></span>
          <span class="w-6 h-0.5 bg-black transition-all" :class="isMenuOpen ? '-rotate-45 -translate-y-2' : ''"></span>
        </button>
      </div>
    </div>

    <!-- Menú mobile -->
    <div
      v-if="isMenuOpen"
      class="lg:hidden bg-primary/95 backdrop-blur-sm border-t border-black/20"
    >
      <div class="flex flex-col gap-1 px-4 py-4">
        <router-link
          v-for="link in navLinks"
          :key="link.id"
          :to="link.path"
          class="px-4 py-3 text-black font-bold text-sm tracking-wider uppercase hover:bg-black/10 rounded transition-colors flex items-center gap-3"
          @click="isMenuOpen = false"
        >
          <component :is="link.icon" class="w-5 h-5" />
          {{ link.label }}
        </router-link>

        <!-- Separador -->
        <div class="border-t border-black/20 my-2"></div>

        <!-- Acceso Jugadora -->
        <router-link
          to="/login-jugadora"
          class="px-4 py-3 text-black font-bold text-sm tracking-wider uppercase hover:bg-black/10 rounded transition-colors flex items-center gap-3"
          @click="isMenuOpen = false"
        >
          <UserIcon class="w-5 h-5" />
          Acceso Jugadora
        </router-link>

        <!-- Admin -->
        <router-link
          to="/login"
          class="px-4 py-3 text-black font-bold text-sm tracking-wider uppercase hover:bg-black/10 rounded transition-colors flex items-center gap-3"
          @click="isMenuOpen = false"
        >
          <ShieldCheckIcon class="w-5 h-5" />
          Administración
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  PhotoIcon, 
  EnvelopeIcon,
  UserCircleIcon,
  PhoneIcon,
  TrophyIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const isMenuOpen = ref(false);
const brandName = 'Vikingas';
const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/fitapp-4fa5d.firebasestorage.app/o/VK%20LOGO%20COLOR.png?alt=media&token=ab878fc2-6dc0-4e90-9608-04acfb146b27';

const navLinks = [
  { id: 1, label: 'Historia', path: '/historia', icon: BookOpenIcon },
  { id: 2, label: 'Calendario', path: '/calendario', icon: CalendarIcon },
  { id: 3, label: 'Equipo', path: '/equipo', icon: UserGroupIcon },
  { id: 4, label: 'Competencias', path: '/competencias', icon: TrophyIcon },
  { id: 5, label: 'Estadísticas', path: '/estadisticas', icon: ChartBarIcon },
  { id: 6, label: 'Indumentarias', path: '/indumentarias', icon: PhotoIcon },
  { id: 7, label: 'Fotos', path: '/fotos', icon: PhotoIcon },
  { id: 8, label: 'Contacto', path: '/contacto', icon: EnvelopeIcon },
];
</script>
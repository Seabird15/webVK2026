<template>
  <nav class="bg-primary-dark text-black">
    <!-- Frase inspiradora -->
    <div class="bg-black text-white text-center py-2 px-4 text-xs md:text-sm font-semibold tracking-wider">
"Cuando pienses en dejarlo, recuerda el porqué comenzaste"
    </div>

    <!-- Barra de navegación principal -->
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
      <div class="hidden md:flex items-center gap-8 flex-1 justify-start ml-10">
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
              <!-- Admin link -->
        <router-link
          to="/login"
          class="text-black font-bold text-xs tracking-wider hover:text-black/70 transition-colors"
          title="Administración"
        >
          <UserCircleIcon class="w-6 h-6" />
        </router-link>
          <a 
            href="https://wa.me/YOUR_PHONE"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            class="text-black hover:text-black/70 transition-colors"
          >
            <PhoneIcon class="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a 
            href="https://instagram.com/YOUR_HANDLE"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="text-black hover:text-black/70 transition-colors"
          >
            <GlobeAltIcon class="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </div>

        <!-- Botón menú mobile -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden flex flex-col gap-1.5 focus:outline-none"
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
      class="md:hidden bg-primary/95 backdrop-blur-sm border-t border-black/20"
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
          🏐 Acceso Jugadora
        </router-link>

        <!-- Admin -->
        <router-link
          to="/login"
          class="px-4 py-3 text-black font-bold text-sm tracking-wider uppercase hover:bg-black/10 rounded transition-colors flex items-center gap-3"
          @click="isMenuOpen = false"
        >
          👤 Administración
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
  GlobeAltIcon,
  TrophyIcon
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
  // { id: 5, label: 'Indumentaria', path: '/indumentaria' },
  { id: 6, label: 'Fotos', path: '/fotos', icon: PhotoIcon },
  { id: 7, label: 'Contacto', path: '/contacto', icon: EnvelopeIcon },
];
</script>
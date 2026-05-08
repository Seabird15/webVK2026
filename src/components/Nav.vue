<template>
  <nav class="bg-primary-dark text-black">
    <!-- Frase  -->
    <div class="sticky top-0 z-50 bg-black text-white text-center py-2 px-4 text-xs md:text-sm font-semibold tracking-wider shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
"Cuando pienses en dejarlo, recuerda el porqué comenzaste"
    </div>

    <!-- navegación principal -->
    <div class="mx-auto max-w-screen-2xl px-4 py-3 md:px-6 xl:px-8">
      <div class="flex justify-between lg:gap-4">
        <!-- Logo -->
        <router-link to="/" class="shrink-0 hover:opacity-80 transition-opacity">
          <img 
            :src="logoUrl" 
            :alt="brandName" 
            class="h-10 w-auto cursor-pointer md:h-11"
          >
        </router-link>

        <!-- Links de navegación - Desktop -->
        <div class="hidden lg:flex min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 xl:gap-x-5 xl:px-6 2xl:gap-x-6">
          <template v-for="link in navLinks" :key="link.id">
            <div
              v-if="link.children"
              class="relative"
            >
              <button
                type="button"
                class="text-black cursor-pointer font-bold text-[11px] xl:text-xs tracking-[0.14em] xl:tracking-[0.16em] transition-colors uppercase flex items-center gap-1.5 whitespace-nowrap"
                :class="isGroupActive(link) || openDesktopMenuId === link.id ? 'text-black' : 'hover:text-black/70'"
                :aria-label="`Mostrar submenu de ${link.label}`"
                :aria-expanded="openDesktopMenuId === link.id"
                @click="toggleDesktopSubmenu(link.id)"
              >
                <component :is="link.icon" class="w-4 h-4 shrink-0" />
                {{ link.label }}
                <ChevronDownIcon
                  class="h-4 w-4 transition-transform duration-200"
                  :class="openDesktopMenuId === link.id ? 'rotate-180' : ''"
                />
              </button>

              <div
                v-if="openDesktopMenuId === link.id"
                class="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-black/10 bg-[#151515] text-white shadow-[0_20px_45px_rgba(0,0,0,0.32)]"
              >
                <div class="border-b text-primary px-4 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-black">
                  Competiciones Vikingas
                </div>

                <div class="p-2  space-y-2">
                  <router-link
                    v-for="child in link.children"
                    :key="child.id"
                    :to="child.path"
                    class="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-200"
                    :class="[
                      isLinkActive(child.path)
                        ? 'bg-white text-black shadow-[0_12px_30px_rgba(255,255,255,0.18)]'
                        : 'text-white hover:bg-white/10',
                      child.featured ? 'ring-1 ring-[#c9a84c]/40' : ''
                    ]"
                    @click="closeDesktopSubmenu()"
                  >
                    <span class="flex items-center gap-3 min-w-0">
                      <component :is="child.icon" class="h-5 w-5 shrink-0" />
                      <span class="min-w-0">
                        <span class="block truncate text-xs font-extrabold uppercase tracking-[0.2em]">{{ child.label }}</span>
                        <span class="block text-[11px] font-medium tracking-[0.08em]" :class="isLinkActive(child.path) ? 'text-black/70' : 'text-white/70'">
                          {{ child.description }}
                        </span>
                      </span>
                    </span>

                    <span
                      v-if="child.featured"
                      class="shrink-0 rounded-full bg-[#c9a84c] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black"
                    >
                      Destacado
                    </span>
                  </router-link>
                </div>
              </div>
            </div>

            <router-link 
              v-else
              :to="link.path"
              class="text-black font-bold text-[11px] xl:text-xs tracking-[0.14em] xl:tracking-[0.16em] transition-colors uppercase flex items-center gap-1.5 whitespace-nowrap"
              :class="isLinkActive(link.path) ? 'text-black' : 'hover:text-black/70'"
            >
              <component :is="link.icon" class="w-4 h-4 shrink-0" />
              {{ link.label }}
            </router-link>
          </template>
        </div>

        <div class="flex items-center justify-end gap-3 md:gap-4 lg:justify-self-end">
          <!-- Links de redes sociales -->
          <div class="flex items-center gap-2 md:gap-3">
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
              <UserCircleIcon class="w-6 h-6 md:w-7 md:h-7" />
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
              @click="trackOutboundClick('https://instagram.com/cdvikingas', 'Instagram nav')"
              class="text-black hover:text-black/70 transition-colors"
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

    </div>

    <!-- Menú mobile -->
    <div
      v-if="isMenuOpen"
      class="lg:hidden bg-primary/95 backdrop-blur-sm border-t border-black/20"
    >
      <div class="flex flex-col gap-1 px-4 py-4">
        <template v-for="link in navLinks" :key="link.id">
          <div v-if="link.children" class="rounded-xl">
            <div class="p-2">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-black font-bold text-sm tracking-wider uppercase transition-colors"
                :class="openMobileMenuId === link.id ? 'bg-black/10' : 'hover:bg-black/10'"
                :aria-label="`Mostrar submenu de ${link.label}`"
                :aria-expanded="openMobileMenuId === link.id"
                @click="toggleMobileSubmenu(link.id)"
              >
                <span class="flex min-w-0 items-center gap-3">
                <component :is="link.icon" class="w-5 h-5 shrink-0" />
                  <span class="truncate">{{ link.label }}</span>
                </span>
                <ChevronDownIcon
                  class="h-5 w-5 transition-transform duration-200"
                  :class="openMobileMenuId === link.id ? 'rotate-180' : ''"
                />
              </button>
            </div>

            <div v-if="openMobileMenuId === link.id" class="space-y-2 px-3 pb-3">
              <router-link
                v-for="child in link.children"
                :key="child.id"
                :to="child.path"
                class="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors"
                :class="[
                  isLinkActive(child.path) ? 'bg-black text-primary' : 'bg-white/50 hover:bg-black/10 text-black',
                  child.featured ? 'border border-[#c9a84c]/60' : ''
                ]"
                @click="handleMobileNavigation()"
              >
                <span class="flex items-center gap-3 min-w-0">
                  <component :is="child.icon" class="h-5 w-5 shrink-0" />
                  <span class="min-w-0">
                    <span class="block truncate text-sm font-extrabold uppercase tracking-[0.14em]">{{ child.label }}</span>
                    <span class="block text-[11px] font-medium normal-case tracking-[0.04em]" :class="isLinkActive(child.path) ? 'text-primary/80' : 'text-black/60'">
                      {{ child.description }}
                    </span>
                  </span>
                </span>

                <span
                  v-if="child.featured"
                  class="shrink-0 rounded-full bg-[#c9a84c] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black"
                >
                  VK
                </span>
              </router-link>
            </div>
          </div>

          <router-link
            v-else
            :to="link.path"
            class="px-4 py-3 text-black font-bold text-sm tracking-wider uppercase rounded transition-colors flex items-center gap-3"
            :class="isLinkActive(link.path) ? 'bg-black text-primary' : 'hover:bg-black/10'"
            @click="handleMobileNavigation()"
          >
            <component :is="link.icon" class="w-5 h-5" />
            {{ link.label }}
          </router-link>
        </template>

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
import { useRoute } from 'vue-router';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ChevronDownIcon,
  UserGroupIcon, 
  ChartBarIcon, 
  PhotoIcon, 
  EnvelopeIcon,
  UserCircleIcon,
  TrophyIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';
import { trackOutboundClick } from '../composables/useAnalytics';

const isMenuOpen = ref(false);
const openDesktopMenuId = ref(null);
const openMobileMenuId = ref(null);
const route = useRoute();
const brandName = 'Vikingas';
const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/fitapp-4fa5d.firebasestorage.app/o/VK%20LOGO%20COLOR.png?alt=media&token=ab878fc2-6dc0-4e90-9608-04acfb146b27';

const navLinks = [
  { id: 1, label: 'Historia', path: '/historia', icon: BookOpenIcon },
  { id: 2, label: 'Calendario', path: '/calendario', icon: CalendarIcon },
  { id: 3, label: 'Equipo', path: '/equipo', icon: UserGroupIcon },
  {
    id: 4,
    label: 'Competencias',
    icon: TrophyIcon,
    children: [
      {
        id: 'competencias',
        label: 'Liga y resultados',
        path: '/competencias',
        icon: TrophyIcon,
        description: 'Tabla, fixture y seguimiento oficial'
      },
      {
        id: 'campeonato-vk',
        label: 'Campeonato VK',
        path: '/campeonato-vikingas-4ta',
        icon: TrophyIcon,
        description: '4ta versión campeonato VK',
        featured: true
      }
    ]
  },
  { id: 6, label: 'Estadísticas', path: '/estadisticas', icon: ChartBarIcon },
  { id: 7, label: 'Indumentaria', path: '/indumentaria', icon: PhotoIcon },
  { id: 8, label: 'Fotos', path: '/fotos', icon: PhotoIcon },
  { id: 9, label: 'Contacto', path: '/contacto', icon: EnvelopeIcon },
];

const isLinkActive = (path) => route.path === path;

const isGroupActive = (link) => link.children?.some((child) => isLinkActive(child.path));

const closeDesktopSubmenu = () => {
  openDesktopMenuId.value = null;
};

const toggleDesktopSubmenu = (id) => {
  openDesktopMenuId.value = openDesktopMenuId.value === id ? null : id;
};

const toggleMobileSubmenu = (id) => {
  openMobileMenuId.value = openMobileMenuId.value === id ? null : id;
};

const handleMobileNavigation = () => {
  isMenuOpen.value = false;
  openMobileMenuId.value = null;
};
</script>
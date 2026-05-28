<template>
  <nav class="sticky top-0 z-50 bg-primary-dark text-black shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
    <div class="bg-black px-4 py-2 text-center text-xs font-semibold text-white md:text-sm">
      "Cuando pienses en dejarlo, recuerda el porqué comenzaste"
    </div>

    <div class="mx-auto max-w-screen-2xl px-4 py-3 md:px-6 xl:px-8">
      <div class="flex items-center justify-between gap-4">
        <router-link to="/" class="flex shrink-0 items-center" aria-label="Ir al inicio">
          <img :src="logoUrl" :alt="brandName" class="h-11 w-auto md:h-12" />
        </router-link>

        <div class="hidden min-w-0 flex-1 items-center justify-center gap-0.5 2xl:flex">
          <template v-for="link in navLinks" :key="link.id">
            <div v-if="link.children" class="relative">
              <button
                type="button"
                class="flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold uppercase transition-colors xl:px-3 xl:text-xs"
                :class="isGroupActive(link) || openDesktopMenuId === link.id ? 'bg-black text-primary' : 'text-black hover:bg-black/10'"
                :aria-label="`Mostrar submenu de ${link.label}`"
                :aria-expanded="openDesktopMenuId === link.id"
                @click="toggleDesktopSubmenu(link.id)"
              >
                <component :is="link.icon" class="size-4 shrink-0" aria-hidden="true" />
                {{ link.label }}
                <ChevronDownIcon
                  class="size-4 transition-transform duration-200"
                  :class="openDesktopMenuId === link.id ? 'rotate-180' : ''"
                  aria-hidden="true"
                />
              </button>

              <div
                v-if="openDesktopMenuId === link.id"
                class="absolute left-1/2 top-full z-50 mt-3 w-80 -translate-x-1/2 overflow-hidden rounded-lg border border-black/10 bg-[#101010] text-white shadow-[0_22px_48px_rgba(0,0,0,0.35)]"
              >
                <div class="border-b border-white/10 px-4 py-4">
                  <p class="text-xs font-black uppercase text-primary">Competencias Vikingas</p>
                  <p class="mt-1 text-sm font-semibold text-white/65">Resultados, torneos y seguimiento deportivo.</p>
                </div>

                <div class="grid gap-2 p-2">
                  <router-link
                    v-for="child in link.children"
                    :key="child.id"
                    :to="child.path"
                    class="flex items-center justify-between gap-3 rounded-lg px-4 py-3 transition-colors"
                    :class="[
                      isLinkActive(child.path) ? 'bg-primary text-black' : 'text-white hover:bg-white/10',
                      child.featured ? 'border border-[#d8b45d]/60' : ''
                    ]"
                    @click="closeDesktopSubmenu()"
                  >
                    <span class="flex min-w-0 items-center gap-3">
                      <component :is="child.icon" class="size-5 shrink-0" aria-hidden="true" />
                      <span class="min-w-0">
                        <span class="block truncate text-sm font-black uppercase">{{ child.label }}</span>
                        <span class="block truncate text-xs font-semibold" :class="isLinkActive(child.path) ? 'text-black/65' : 'text-white/60'">
                          {{ child.description }}
                        </span>
                      </span>
                    </span>
                    <span v-if="child.featured" class="shrink-0 rounded-sm bg-[#d8b45d] px-2 py-1 text-xs font-black uppercase text-black">
                      VK
                    </span>
                  </router-link>
                </div>
              </div>
            </div>

            <router-link
              v-else
              :to="link.path"
              class="flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold uppercase transition-colors xl:px-3 xl:text-xs"
              :class="isLinkActive(link.path) ? 'bg-black text-primary' : 'text-black hover:bg-black/10'"
            >
              <component :is="link.icon" class="size-4 shrink-0" aria-hidden="true" />
              {{ link.label }}
            </router-link>
          </template>
        </div>

        <div class="flex shrink-0 items-center justify-end gap-2">
          <div class="hidden items-center gap-2 md:flex">
            <router-link
              v-for="access in quickAccessLinks"
              :key="access.path"
              :to="access.path"
              class="flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-black uppercase transition-colors xl:px-4"
              :class="access.variant === 'admin' ? 'bg-black text-white hover:bg-black/85' : 'bg-white text-black hover:bg-white/85'"
            >
              <component :is="access.icon" class="size-4" aria-hidden="true" />
              {{ access.label }}
            </router-link>
          </div>

          <router-link
            to="/login-jugadora"
            class="flex size-11 items-center justify-center rounded-lg bg-white/75 text-black transition-colors hover:bg-white md:hidden"
            aria-label="Acceso jugadoras"
          >
            <UserIcon class="size-6" aria-hidden="true" />
          </router-link>

          <router-link
            to="/login"
            class="flex size-11 items-center justify-center rounded-lg bg-black text-white transition-colors hover:bg-black/85 md:hidden"
            aria-label="Acceso administración"
          >
            <ShieldCheckIcon class="size-6" aria-hidden="true" />
          </router-link>

          <a
            href="https://instagram.com/cdvikingas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="hidden size-11 items-center justify-center rounded-lg text-black transition-colors hover:bg-black/10 sm:flex"
            @click="trackOutboundClick('https://instagram.com/cdvikingas', 'Instagram nav')"
          >
            <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <button
            type="button"
            class="flex size-11 items-center justify-center rounded-lg text-black transition-colors hover:bg-black/10 2xl:hidden"
            :aria-expanded="isMenuOpen"
            aria-label="Abrir menú"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span class="flex flex-col gap-1.5">
              <span class="h-0.5 w-6 bg-black transition-all" :class="isMenuOpen ? 'translate-y-2 rotate-45' : ''"></span>
              <span class="h-0.5 w-6 bg-black transition-all" :class="isMenuOpen ? 'opacity-0' : ''"></span>
              <span class="h-0.5 w-6 bg-black transition-all" :class="isMenuOpen ? '-translate-y-2 -rotate-45' : ''"></span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isMenuOpen" class="border-t border-black/20 bg-primary-dark px-4 pb-5 pt-3 2xl:hidden">
      <div class="mb-4 grid grid-cols-2 gap-3">
        <router-link
          v-for="access in quickAccessLinks"
          :key="`mobile-${access.path}`"
          :to="access.path"
          class="rounded-lg p-4"
          :class="access.variant === 'admin' ? 'bg-black text-white' : 'bg-white text-black'"
          @click="handleMobileNavigation()"
        >
          <component :is="access.icon" class="size-6" aria-hidden="true" />
          <span class="mt-3 block text-sm font-black uppercase">{{ access.label }}</span>
          <span class="mt-1 block text-xs font-semibold" :class="access.variant === 'admin' ? 'text-white/65' : 'text-black/60'">
            {{ access.description }}
          </span>
        </router-link>
      </div>

      <div class="grid gap-1">
        <template v-for="link in navLinks" :key="link.id">
          <div v-if="link.children">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-black uppercase text-black transition-colors"
              :class="openMobileMenuId === link.id ? 'bg-black/10' : 'hover:bg-black/10'"
              :aria-label="`Mostrar submenu de ${link.label}`"
              :aria-expanded="openMobileMenuId === link.id"
              @click="toggleMobileSubmenu(link.id)"
            >
              <span class="flex min-w-0 items-center gap-3">
                <component :is="link.icon" class="size-5 shrink-0" aria-hidden="true" />
                <span class="truncate">{{ link.label }}</span>
              </span>
              <ChevronDownIcon
                class="size-5 transition-transform duration-200"
                :class="openMobileMenuId === link.id ? 'rotate-180' : ''"
                aria-hidden="true"
              />
            </button>

            <div v-if="openMobileMenuId === link.id" class="grid gap-2 px-2 pb-2">
              <router-link
                v-for="child in link.children"
                :key="child.id"
                :to="child.path"
                class="flex items-center justify-between gap-3 rounded-lg px-4 py-3 transition-colors"
                :class="isLinkActive(child.path) ? 'bg-black text-primary' : 'bg-white/55 text-black hover:bg-white/75'"
                @click="handleMobileNavigation()"
              >
                <span class="flex min-w-0 items-center gap-3">
                  <component :is="child.icon" class="size-5 shrink-0" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block truncate text-sm font-black uppercase">{{ child.label }}</span>
                    <span class="block truncate text-xs font-semibold opacity-70">{{ child.description }}</span>
                  </span>
                </span>
                <span v-if="child.featured" class="rounded-sm bg-[#d8b45d] px-2 py-1 text-xs font-black uppercase text-black">
                  VK
                </span>
              </router-link>
            </div>
          </div>

          <router-link
            v-else
            :to="link.path"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black uppercase transition-colors"
            :class="isLinkActive(link.path) ? 'bg-black text-primary' : 'text-black hover:bg-black/10'"
            @click="handleMobileNavigation()"
          >
            <component :is="link.icon" class="size-5" aria-hidden="true" />
            {{ link.label }}
          </router-link>
        </template>

        <a
          href="https://instagram.com/cdvikingas"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black uppercase text-black hover:bg-black/10 sm:hidden"
          @click="trackOutboundClick('https://instagram.com/cdvikingas', 'Instagram nav')"
        >
          <PhotoIcon class="size-5" aria-hidden="true" />
          Instagram
        </a>
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
  ChartBarIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhotoIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
import { trackOutboundClick } from '../composables/useAnalytics';
import logoVikingas from '../assets/logoVk.png';

const isMenuOpen = ref(false);
const openDesktopMenuId = ref(null);
const openMobileMenuId = ref(null);
const route = useRoute();
const brandName = 'Vikingas';
const logoUrl = logoVikingas;

const quickAccessLinks = [
  {
    label: 'Jugadoras',
    description: 'Entrenamientos',
    path: '/login-jugadora',
    icon: UserIcon,
    variant: 'players',
  },
  {
    label: 'Admin',
    description: 'Panel interno',
    path: '/login',
    icon: LockClosedIcon,
    variant: 'admin',
  },
];

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
        description: 'Tabla, fixture y seguimiento oficial',
      },
      {
        id: 'campeonato-vk',
        label: 'Campeonato VK',
        path: '/campeonato-vikingas-4ta',
        icon: TrophyIcon,
        description: '4ta versión campeonato VK',
        featured: true,
      },
    ],
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

<template>
  <section class="min-h-dvh bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
    <div class="mx-auto grid min-h-[calc(100dvh-5rem)] max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <div class="relative hidden min-h-full overflow-hidden bg-slate-900 lg:block">
        <img
          :src="adminImage"
          alt="Equipo Vikingas reunido en cancha"
          class="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div class="absolute inset-0 bg-slate-950/60"></div>

        <div class="relative flex h-full flex-col justify-between p-10">
          <div class="flex items-center gap-3">
            <img :src="logoVikingas" alt="VK Vikingas" class="size-14 rounded-lg bg-white p-2 object-contain" />
            <div>
              <p class="text-xs font-black uppercase text-[#d8b45d]">VK Vikingas</p>
              <p class="text-sm font-semibold text-white/75">Administración del sitio</p>
            </div>
          </div>

          <div class="max-w-xl">
            <p class="mb-4 inline-flex rounded-sm bg-[#d8b45d] px-3 py-2 text-xs font-black uppercase text-slate-950">
              Acceso restringido
            </p>
            <h1 class="text-balance text-6xl font-black leading-none" style="font-family: 'Gobold High', system-ui, sans-serif;">
              Panel administrativo
            </h1>
            <p class="mt-5 text-pretty text-lg font-semibold leading-relaxed text-white/80">
              Gestión de entrenamientos, calendario, jugadoras, comunicaciones internas y contenidos del club.
            </p>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div v-for="item in adminScopes" :key="item.label" class="border border-white/15 bg-slate-950/70 p-4">
              <component :is="item.icon" class="size-6 text-[#d8b45d]" aria-hidden="true" />
              <p class="mt-3 text-xs font-black uppercase text-white/80">{{ item.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center bg-stone-50 px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
        <div class="mx-auto w-full max-w-md">
          <div class="mb-8 flex items-center gap-4 lg:hidden">
            <img :src="logoVikingas" alt="VK Vikingas" class="size-16 rounded-lg bg-white p-2 object-contain shadow-sm" />
            <div>
              <p class="text-xs font-black uppercase text-[#9f7c26]">Acceso restringido</p>
              <h1 class="text-3xl font-black leading-none" style="font-family: 'Gobold High', system-ui, sans-serif;">
                Admin VK
              </h1>
            </div>
          </div>

          <div class="mb-8">
            <p class="text-sm font-black uppercase text-[#9f7c26]">Inicio de sesión</p>
            <h2 class="mt-3 text-balance text-4xl font-black leading-tight sm:text-5xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
              Entrar al panel
            </h2>
            <p class="mt-3 text-pretty text-sm leading-relaxed text-slate-600">
              Usa tus credenciales de administración o cuerpo técnico. Tu sesión queda persistente en este dispositivo.
            </p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div class="space-y-2">
              <label for="admin-email" class="flex items-center gap-2 text-sm font-black uppercase text-slate-700">
                <EnvelopeIcon class="size-5 text-[#9f7c26]" aria-hidden="true" />
                Email
              </label>
              <input
                id="admin-email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="isLoading"
                class="min-h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-950 outline-none focus:border-[#9f7c26] focus:ring-2 focus:ring-[#d8b45d]/40 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="admin@vikingas.cl"
              />
            </div>

            <div class="space-y-2">
              <label for="admin-password" class="flex items-center gap-2 text-sm font-black uppercase text-slate-700">
                <LockClosedIcon class="size-5 text-[#9f7c26]" aria-hidden="true" />
                Contraseña
              </label>
              <input
                id="admin-password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                class="min-h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-950 outline-none focus:border-[#9f7c26] focus:ring-2 focus:ring-[#d8b45d]/40 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="••••••••"
              />
            </div>

            <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
              <div class="flex gap-3">
                <ExclamationTriangleIcon class="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
                <p>{{ error }}</p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" aria-hidden="true" />
              <ShieldCheckIcon v-else class="size-5 text-[#d8b45d]" aria-hidden="true" />
              {{ isLoading ? 'Verificando acceso...' : 'Ingresar al admin' }}
            </button>
          </form>

          <div class="mt-6 rounded-lg border border-[#d8b45d]/50 bg-[#fff8e5] p-4">
            <div class="flex gap-3">
              <IdentificationIcon class="size-5 shrink-0 text-[#9f7c26]" aria-hidden="true" />
              <p class="text-pretty text-sm font-semibold leading-relaxed text-slate-700">
                Esta entrada es exclusiva para administración y staff autorizado. Las jugadoras deben usar el acceso de jugadoras.
              </p>
            </div>
          </div>

          <p class="mt-6 text-center text-sm font-semibold text-slate-500">
            ¿No tienes cuenta? Solicítala al administrador principal.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline';
import { login, isLoading, error, authUser, userRole } from '../firebase/auth';
import logoVikingas from '../assets/logoVk.png';
import adminImage from '../assets/2026/grupo.webp';

const router = useRouter();
const email = ref('');
const password = ref('');

const adminScopes = [
  { label: 'Jugadoras', icon: UsersIcon },
  { label: 'Calendario', icon: CalendarDaysIcon },
  { label: 'Reportes', icon: ChartBarIcon },
];

watchEffect(() => {
  if (authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
    router.push('/admin');
  }
});

const handleLogin = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    router.push('/admin');
  }
};
</script>

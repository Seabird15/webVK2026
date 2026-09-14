<template>
  <section class="relative min-h-dvh overflow-hidden bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
    <div class="pointer-events-none absolute inset-0 select-none text-primary/10">
      <span class="absolute -left-5 top-28 text-8xl font-black leading-none opacity-70 sm:text-9xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
        VK
      </span>
      <span class="absolute right-4 top-20 text-7xl font-black leading-none sm:text-8xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
        #
      </span>
      <span class="absolute bottom-24 right-0 text-9xl font-black leading-none opacity-40 sm:text-[11rem]" style="font-family: 'Gobold High', system-ui, sans-serif;">
        VK
      </span>
    </div>

    <div class="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center gap-6 lg:max-w-5xl lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <aside class="hidden rounded-lg border border-white/10 bg-slate-950/90 p-8 shadow-2xl lg:block">
        <p class="text-sm font-black uppercase text-primary">Panel administrativo</p>
        <h1 class="mt-4 text-balance text-6xl font-black leading-none" style="font-family: 'Gobold High', system-ui, sans-serif;">
          Gestiona el club desde un solo lugar
        </h1>
        <p class="mt-5 text-pretty text-base font-semibold leading-relaxed text-white/70">
          Control de jugadoras, calendario, entrenamientos, comunicaciones internas y contenidos del equipo.
        </p>

        <div class="mt-8 grid gap-3">
          <div v-for="item in adminScopes" :key="item" class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/8">
            <p class="text-sm font-black uppercase text-white">{{ item }}</p>
          </div>
        </div>
      </aside>

      <div class="overflow-hidden rounded-lg border-2 border-primary bg-white text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <header class="relative overflow-hidden px-6 pb-7 pt-7 text-center sm:px-8">
          <div class="pointer-events-none absolute left-4 top-28 text-6xl font-black text-primary/10 sm:text-7xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
            VK
          </div>
          <div class="pointer-events-none absolute right-5 top-5 text-6xl font-black text-primary/10" style="font-family: 'Gobold High', system-ui, sans-serif;">
            #
          </div>

          <img
            :src="logoVikingas"
            alt="VK Vikingas"
            class="mx-auto size-24 object-contain drop-shadow-lg"
          />

          <h2 class="mt-4 text-3xl font-black leading-none text-slate-950" style="font-family: 'Gobold High', system-ui, sans-serif;">
            VK Vikingas
          </h2>

          <div class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-black uppercase text-white shadow-lg">
            <ShieldCheckIcon class="size-5" aria-hidden="true" />
            Administración
          </div>
        </header>

        <div class="border-y border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-center gap-4">
            <div class="h-1 flex-1 rounded-full bg-primary/25"></div>
            <BoltIcon class="size-5 text-primary" aria-hidden="true" />
            <div class="h-1 flex-1 rounded-full bg-primary/25"></div>
          </div>
        </div>

        <form class="space-y-5 px-6 py-7 sm:px-8" :aria-busy="isLoading" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <label for="admin-email" class="flex items-center gap-2 text-xs font-black uppercase text-slate-700">
              <EnvelopeIcon class="size-4 text-primary" aria-hidden="true" />
              Correo electrónico
            </label>
            <div class="relative">
              <UserCircleIcon class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary/75" aria-hidden="true" />
              <input
                id="admin-email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="isLoading"
                class="min-h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 pl-12 text-base font-semibold text-slate-950 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="admin@vikingas.cl"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="admin-password" class="flex items-center gap-2 text-xs font-black uppercase text-slate-700">
              <ShieldCheckIcon class="size-4 text-primary" aria-hidden="true" />
              Contraseña
            </label>
            <div class="relative">
              <LockClosedIcon class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary/75" aria-hidden="true" />
              <input
                id="admin-password"
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                class="min-h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 pl-12 pr-12 text-base font-semibold text-slate-950 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                :disabled="isLoading"
                class="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                :aria-label="passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="passwordVisible = !passwordVisible"
              >
                <EyeSlashIcon v-if="passwordVisible" class="size-5" aria-hidden="true" />
                <EyeIcon v-else class="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3" role="alert" aria-live="assertive">
            <div class="flex items-start gap-3">
              <ExclamationTriangleIcon class="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
              <p class="text-sm font-bold text-red-700">{{ error }}</p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-black uppercase text-white shadow-lg transition-transform duration-200 hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" aria-hidden="true" />
            <BoltIcon v-else class="size-5" aria-hidden="true" />
            {{ isLoading ? 'Verificando acceso...' : 'Ingresar al panel' }}
          </button>
        </form>

        <footer class="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center sm:px-8">
          <p class="text-sm font-semibold text-slate-600">Acceso reservado para administración y cuerpo técnico.</p>
          <p class="mt-2 text-xs text-slate-500">Si no tienes credenciales, solicita acceso al administrador principal.</p>
        </footer>
      </div>

      <div class="mx-auto inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white lg:col-span-2 lg:justify-self-center">
        <ShieldCheckIcon class="size-5 text-primary" aria-hidden="true" />
        <p class="text-sm font-bold">Portal exclusivo para staff VK Vikingas</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowPathIcon,
  BoltIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline';
import { login, isLoading, error, authUser, userRole } from '../firebase/auth';
import logoVikingas from '../assets/logoVk.png';

const router = useRouter();
const email = ref('');
const password = ref('');
const passwordVisible = ref(false);

const adminScopes = [
  'Jugadoras',
  'Calendario',
  'Entrenamientos',
  'Reportes',
  'Comunicaciones',
];

watchEffect(() => {
  if (authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
    router.push('/admin');
  }
});

const handleLogin = async () => {
  error.value = null;

  if (!email.value || !password.value) {
    error.value = 'Completa email y contraseña para continuar';
    return;
  }

  const success = await login(email.value, password.value);
  if (success) {
    router.push('/admin');
  }
};
</script>

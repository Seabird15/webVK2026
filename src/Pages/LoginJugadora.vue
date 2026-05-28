<template>
  <section class="relative min-h-dvh overflow-hidden bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
    <div class="pointer-events-none absolute inset-0 text-primary/10">
      <span class="absolute -left-5 top-28 text-8xl font-black leading-none sm:text-9xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
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
      <aside class="hidden rounded-lg border border-white/10 bg-slate-950 p-8 lg:block">
        <p class="text-sm font-black uppercase text-primary">Portal jugadoras</p>
        <h1 class="mt-4 text-balance text-6xl font-black leading-none" style="font-family: 'Gobold High', system-ui, sans-serif;">
          Entrena, confirma, compite
        </h1>
        <p class="mt-5 text-pretty text-base font-semibold leading-relaxed text-white/70">
          Acceso privado para revisar entrenamientos, convocatorias, asistencia y novedades internas del equipo.
        </p>

        <div class="mt-8 grid gap-3">
          <div v-for="item in playerHighlights" :key="item" class="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <p class="text-sm font-black uppercase text-white">{{ item }}</p>
          </div>
        </div>
      </aside>

      <div class="overflow-hidden rounded-lg border-2 border-primary bg-white text-slate-950 shadow-2xl">
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
            <UserGroupIcon class="size-5" aria-hidden="true" />
            Acceso jugadoras
          </div>
        </header>

        <div class="border-y border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
          <div class="flex items-center justify-center gap-4">
            <div class="h-1 flex-1 rounded-full bg-primary/25"></div>
            <BoltIcon class="size-5 text-primary" aria-hidden="true" />
            <div class="h-1 flex-1 rounded-full bg-primary/25"></div>
          </div>
        </div>

        <form class="space-y-5 px-6 py-7 sm:px-8" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <label for="jugadora-email" class="flex items-center gap-2 text-xs font-black uppercase text-slate-700">
              <EnvelopeIcon class="size-4 text-primary" aria-hidden="true" />
              Correo electrónico
            </label>
            <div class="relative">
              <UserCircleIcon class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary/75" aria-hidden="true" />
              <input
                id="jugadora-email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="isLoading"
                class="min-h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 pl-12 text-base font-semibold text-slate-950 outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="tuemail@ejemplo.com"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="jugadora-password" class="flex items-center gap-2 text-xs font-black uppercase text-slate-700">
              <ShieldCheckIcon class="size-4 text-primary" aria-hidden="true" />
              Contraseña
            </label>
            <div class="relative">
              <LockClosedIcon class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary/75" aria-hidden="true" />
              <input
                id="jugadora-password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                class="min-h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 pl-12 text-base font-semibold text-slate-950 outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3" role="alert">
            <div class="flex items-start gap-3">
              <ExclamationCircleIcon class="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
              <p class="text-sm font-bold text-red-700">{{ error }}</p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-black uppercase text-white shadow-lg transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-55"
          >
            <ArrowPathIcon v-if="isLoading" class="size-5 animate-spin" aria-hidden="true" />
            <BoltIcon v-else class="size-5" aria-hidden="true" />
            {{ isLoading ? 'Iniciando...' : 'Entrar al equipo' }}
          </button>
        </form>

        <footer class="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center sm:px-8">
          <p class="text-sm font-semibold text-slate-600">¿Primera vez en la app?</p>
          <router-link
            to="/solicitud-acceso"
            class="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black text-primary-dark transition-colors hover:bg-primary/10"
          >
            <UserPlusIcon class="size-5" aria-hidden="true" />
            Solicitar acceso al equipo
            <ArrowRightIcon class="size-4" aria-hidden="true" />
          </router-link>
        </footer>
      </div>

      <div class="mx-auto inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white">
        <SparklesIcon class="size-5 text-primary" aria-hidden="true" />
        <p class="text-sm font-bold">Portal exclusivo para jugadoras VK Vikingas</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowPathIcon,
  ArrowRightIcon,
  BoltIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline';
import { loginJugadora, errorJugadora, tienePerfılCompleto, obtenerEquiposJugadora } from '../firebase/jugadorasAuth';
import logoVikingas from '../assets/logoVk.png';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

const playerHighlights = [
  'Confirma entrenamientos',
  'Revisa convocatorias',
  'Actualiza tu perfil',
];

const handleLogin = async () => {
  error.value = null;

  if (!email.value || !password.value) {
    error.value = 'Por favor completa email y contraseña';
    return;
  }

  isLoading.value = true;

  const success = await loginJugadora(email.value, password.value);
  isLoading.value = false;

  if (success) {
    const perfilCompleto = await tienePerfılCompleto();
    if (!perfilCompleto) {
      router.push('/completar-perfil');
    } else {
      const equipos = obtenerEquiposJugadora();
      if (equipos.length > 1) {
        router.push('/seleccionar-categoria');
      } else {
        router.push('/entrenamientos');
      }
    }
  } else {
    error.value = errorJugadora.value || 'Error al iniciar sesión';
  }
};
</script>

<template>
  <section class="min-h-dvh overflow-hidden bg-[#081112] text-white">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
      <aside class="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl lg:p-8">
        <p class="text-sm font-semibold italic text-white/70">Postulación abierta</p>
        <h1 class="mt-4 text-balance text-[clamp(2.7rem,7vw,5.6rem)] font-black uppercase leading-[0.9]" style="font-family: 'Gobold High', sans-serif;">
          Súmate a<br>Vikingas
        </h1>
        <p class="mt-5 max-w-xl text-pretty text-base font-semibold leading-8 text-white/74">
          Si quieres volver a competir, empezar a entrenar o encontrar un club donde el proceso importe de verdad, este es el primer paso.
        </p>

        <div class="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <article v-for="item in highlights" :key="item.title" class="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p class="text-[0.68rem] font-black uppercase text-primary">{{ item.kicker }}</p>
            <h2 class="mt-2 text-lg font-black uppercase text-white">{{ item.title }}</h2>
            <p class="mt-2 text-sm leading-6 text-white/62">{{ item.description }}</p>
          </article>
        </div>

        <div class="mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-5">
          <p class="text-[0.7rem] font-black uppercase text-primary">Cómo funciona</p>
          <ol class="mt-3 space-y-2 text-sm font-semibold text-white/76">
            <li>1. Completa tu postulación y crea tu acceso.</li>
            <li>2. El club revisa tu solicitud y tu categoría de interés.</li>
            <li>3. Si eres aprobada, completas perfil y entras al portal de jugadoras.</li>
          </ol>
        </div>
      </aside>

      <div class="rounded-3xl border border-primary/25 bg-[#f5efe4] p-5 text-slate-950 shadow-2xl sm:p-6 lg:p-8">
        <div v-if="solicitudEnviada" class="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
          <p class="text-[0.72rem] font-black uppercase text-emerald-700">Solicitud recibida</p>
          <h2 class="mt-2 text-balance text-3xl font-black uppercase text-emerald-950" style="font-family: 'Gobold High', sans-serif;">
            Ya estás en revisión
          </h2>
          <p class="mt-4 text-pretty text-base font-semibold leading-7 text-emerald-800">
            Guardamos tu acceso y tu postulación. Ahora administración puede revisar tu categoría de interés, disponibilidad y antecedentes antes de aprobarte.
          </p>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <router-link to="/" class="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-black uppercase text-white">
              Volver al inicio
            </router-link>
            <router-link to="/login-jugadora" class="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-black uppercase text-slate-800">
              Ir a acceso jugadoras
            </router-link>
          </div>
        </div>

        <form v-else class="space-y-6" @submit.prevent="handleSolicitar">
          <div>
            <p class="text-[0.72rem] font-black uppercase text-primary-dark">Ficha inicial</p>
            <h2 class="mt-2 text-balance text-4xl font-black uppercase text-slate-950" style="font-family: 'Gobold High', sans-serif;">
              Queremos conocerte
            </h2>
            <p class="mt-3 text-pretty text-sm font-semibold leading-6 text-slate-600">
              Esta información ayuda a ubicarte mejor dentro del club y priorizar tu ingreso en la categoría correcta.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Nombre</span>
              <input v-model="form.nombre" type="text" required :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. Daniela" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Apellido</span>
              <input v-model="form.apellido" type="text" required :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. Aravena" />
            </label>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block sm:col-span-2">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Correo</span>
              <input v-model="form.email" type="email" required :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="tuemail@ejemplo.com" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Contraseña</span>
              <input v-model="form.password" type="password" minlength="6" required :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Mínimo 6 caracteres" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Confirmar contraseña</span>
              <input v-model="form.passwordConfirm" type="password" minlength="6" required :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Repite tu contraseña" />
            </label>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Categoría de interés</span>
              <select v-model="form.equipoInteres" required :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100">
                <option value="">Selecciona una opción</option>
                <option value="escuela">Escuela</option>
                <option value="ascenso">Ascenso</option>
                <option value="serieC">Serie C</option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Edad</span>
              <input v-model="form.edad" type="number" min="12" max="60" :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. 24" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Comuna</span>
              <input v-model="form.comuna" type="text" :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. Puente Alto" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Teléfono</span>
              <input v-model="form.telefono" type="tel" :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. +56 9 ..." />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Posición</span>
              <input v-model="form.posicion" type="text" :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. Cierre, Ala, Portera" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-black uppercase text-slate-700">Instagram</span>
              <input v-model="form.instagram" type="text" :disabled="isLoading" class="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. @tuusuario" />
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-xs font-black uppercase text-slate-700">Experiencia</span>
            <textarea v-model="form.experiencia" rows="3" :disabled="isLoading" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Cuéntanos si has jugado antes, en qué nivel o hace cuánto volviste a entrenar."></textarea>
          </label>

          <label class="block">
            <span class="mb-2 block text-xs font-black uppercase text-slate-700">Disponibilidad semanal</span>
            <textarea v-model="form.disponibilidad" rows="3" :disabled="isLoading" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Ej. Puedo lunes y miércoles en la noche, fines de semana sí."></textarea>
          </label>

          <label class="block">
            <span class="mb-2 block text-xs font-black uppercase text-slate-700">Mensaje para el club</span>
            <textarea v-model="form.mensaje" rows="4" :disabled="isLoading" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100" placeholder="Cuéntanos por qué quieres sumarte a Vikingas."></textarea>
          </label>

          <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p class="text-sm font-bold text-red-700">{{ error }}</p>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-600">¿Ya tienes acceso aprobado?</p>
              <router-link to="/login-jugadora" class="text-sm font-black uppercase text-primary-dark">Entrar al portal</router-link>
            </div>

            <button type="submit" :disabled="isLoading" class="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-55">
              {{ isLoading ? 'Enviando...' : 'Enviar postulación' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { solicitarAcceso, errorJugadora } from '../firebase/jugadorasAuth';
import { trackSolicitudRegistro } from '../composables/useAnalytics';

const highlights = [
  {
    kicker: 'Proceso real',
    title: 'No entras a ciegas',
    description: 'Tu postulación llega con contexto para que el club revise bien dónde podrías encajar.'
  },
  {
    kicker: 'Categorías',
    title: 'Desde Escuela a competencia',
    description: 'Puedes postular según tu momento: volver a jugar, empezar o competir con más exigencia.'
  },
  {
    kicker: 'Comunidad',
    title: 'Primero el grupo',
    description: 'La idea no es sumar por sumar, sino encontrar jugadoras que quieran construir proceso.'
  }
];

const form = reactive({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  passwordConfirm: '',
  equipoInteres: '',
  edad: '',
  comuna: '',
  telefono: '',
  posicion: '',
  instagram: '',
  experiencia: '',
  disponibilidad: '',
  mensaje: ''
});

const solicitudEnviada = ref(false);
const isLoading = ref(false);
const error = ref('');

const resetForm = () => {
  form.nombre = '';
  form.apellido = '';
  form.email = '';
  form.password = '';
  form.passwordConfirm = '';
  form.equipoInteres = '';
  form.edad = '';
  form.comuna = '';
  form.telefono = '';
  form.posicion = '';
  form.instagram = '';
  form.experiencia = '';
  form.disponibilidad = '';
  form.mensaje = '';
};

const handleSolicitar = async () => {
  error.value = '';

  if (form.password !== form.passwordConfirm) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }

  if (form.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  isLoading.value = true;

  const success = await solicitarAcceso(form.email, form.password, {
    nombre: form.nombre,
    apellido: form.apellido,
    telefono: form.telefono,
    comuna: form.comuna,
    posicion: form.posicion,
    experiencia: form.experiencia,
    disponibilidad: form.disponibilidad,
    instagram: form.instagram,
    mensaje: form.mensaje,
    equipoInteres: form.equipoInteres,
    edad: form.edad
  });

  isLoading.value = false;

  if (success) {
    trackSolicitudRegistro(form.equipoInteres || 'sin_equipo');
    solicitudEnviada.value = true;
    resetForm();
    return;
  }

  error.value = errorJugadora.value || 'No se pudo enviar la postulación.';
};
</script>

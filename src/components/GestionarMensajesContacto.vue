<template>
  <section class="space-y-6">
    <div class="rounded-2xl bg-linear-to-r from-primary-dark to-primary p-6 text-white shadow-xl sm:p-8">
      <p class="text-xs font-black uppercase tracking-[0.24em] text-white/70">Contacto web</p>
      <h2 class="mt-2 text-2xl font-black sm:text-3xl">Personas que quieren acercarse</h2>
      <p class="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">Revisa sus datos y responde por WhatsApp, correo o redes sociales.</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button v-for="filtro in filtros" :key="filtro.id" type="button" class="rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition" :class="filtroActivo === filtro.id ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-primary hover:text-primary'" @click="filtroActivo = filtro.id">
        {{ filtro.label }} <span class="ml-1 opacity-70">{{ contar(filtro.id) }}</span>
      </button>
    </div>

    <div v-if="cargando" class="rounded-2xl bg-white p-12 text-center font-semibold text-gray-500 shadow-xl">Cargando mensajes...</div>
    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center font-semibold text-red-700">No se pudieron cargar los mensajes de contacto.</div>
    <div v-else-if="mensajesVisibles.length === 0" class="rounded-2xl bg-white p-12 text-center shadow-xl">
      <p class="text-lg font-black text-gray-800">No hay mensajes en esta vista</p>
      <p class="mt-2 text-sm text-gray-500">Los nuevos contactos aparecerán aquí automáticamente.</p>
    </div>

    <div v-else class="grid gap-5 xl:grid-cols-2">
      <article v-for="mensaje in mensajesVisibles" :key="mensaje.id" class="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-black text-gray-900">{{ mensaje.nombre }} {{ mensaje.apellido }}</h3>
            <p class="mt-1 text-xs font-black uppercase tracking-[0.16em] text-primary">{{ mensaje.motivo }}</p>
          </div>
          <span class="rounded-full px-3 py-1 text-[11px] font-black uppercase" :class="claseEstado(mensaje.estado)">{{ etiquetaEstado(mensaje.estado) }}</span>
        </div>

        <div class="mt-5 grid gap-2 text-sm text-gray-700">
          <a class="rounded-xl bg-emerald-50 px-4 py-3 font-bold text-emerald-800 hover:bg-emerald-100" :href="enlaceWhatsapp(mensaje.whatsapp)" target="_blank" rel="noopener noreferrer">
            WhatsApp · {{ mensaje.whatsapp }}
          </a>
          <a v-if="mensaje.email" class="rounded-xl bg-gray-50 px-4 py-3 font-semibold hover:bg-gray-100" :href="`mailto:${mensaje.email}`">{{ mensaje.email }}</a>
          <a v-if="mensaje.redesSociales" class="rounded-xl bg-gray-50 px-4 py-3 font-semibold break-all hover:bg-gray-100" :href="enlaceRed(mensaje.redesSociales)" target="_blank" rel="noopener noreferrer">{{ mensaje.redesSociales }}</a>
        </div>

        <div class="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">{{ mensaje.mensaje }}</div>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <time class="text-xs font-semibold text-gray-400">{{ formatearFecha(mensaje.createdAt) }}</time>
          <select v-model="mensaje.estado" class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700" @change="guardarEstado(mensaje)">
            <option value="pendiente">Pendiente</option>
            <option value="contactado">Contactado</option>
            <option value="archivado">Archivado</option>
          </select>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { actualizarEstadoMensajeContacto, escucharMensajesContacto } from '../firebase/mensajesContacto';

const mensajes = ref([]);
const cargando = ref(true);
const error = ref(false);
const filtroActivo = ref('todos');
let unsubscribe = null;

const filtros = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'contactado', label: 'Contactados' },
  { id: 'archivado', label: 'Archivados' }
];

const mensajesVisibles = computed(() => filtroActivo.value === 'todos'
  ? mensajes.value
  : mensajes.value.filter((mensaje) => mensaje.estado === filtroActivo.value));

const contar = (estado) => estado === 'todos' ? mensajes.value.length : mensajes.value.filter((mensaje) => mensaje.estado === estado).length;
const etiquetaEstado = (estado) => ({ pendiente: 'Pendiente', contactado: 'Contactado', archivado: 'Archivado' }[estado] || estado);
const claseEstado = (estado) => ({ pendiente: 'bg-amber-100 text-amber-800', contactado: 'bg-emerald-100 text-emerald-800', archivado: 'bg-gray-100 text-gray-600' }[estado] || 'bg-gray-100 text-gray-600');
const formatearFecha = (valor) => {
  const fecha = typeof valor?.toDate === 'function' ? valor.toDate() : new Date(valor);
  return Number.isNaN(fecha.getTime()) ? 'Fecha no disponible' : fecha.toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
};
const enlaceWhatsapp = (numero) => `https://wa.me/${(numero || '').replace(/\D/g, '').replace(/^0/, '56')}`;
const enlaceRed = (red) => /^https?:\/\//i.test(red) ? red : `https://instagram.com/${red.replace(/^@/, '').trim()}`;

const guardarEstado = async (mensaje) => {
  try {
    await actualizarEstadoMensajeContacto(mensaje.id, mensaje.estado);
  } catch (err) {
    console.error('Error actualizando estado del contacto:', err);
    alert('No se pudo actualizar el estado.');
  }
};

onMounted(() => {
  unsubscribe = escucharMensajesContacto((datos) => {
    mensajes.value = datos;
    cargando.value = false;
  }, () => {
    error.value = true;
    cargando.value = false;
  });
});

onUnmounted(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
});
</script>

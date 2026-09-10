<template>
  <section class="contacto-page overflow-hidden bg-(--ct-bg) text-(--ct-text) min-h-screen">

    <!-- Hero -->
    <div class="relative isolate">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.18)_0%,rgba(11,17,18,0.78)_55%,rgba(11,17,18,0.98)_100%)]"></div>
        <div class="absolute left-[-6%] top-16 h-56 w-56 rounded-full bg-(--ct-primary)/14 blur-3xl"></div>
        <div class="absolute right-[-8%] top-0 h-64 w-64 rounded-full bg-(--ct-accent)/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 text-center mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pb-12 lg:pt-18">
   
        <h1 class="ct-fade mt-4 uppercase leading-[0.88]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(3.5rem, 12vw, 7.5rem);">
          <span class="block text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.85)]">¿Quieres ser parte de</span>
          <span class="block text-white">Vikingas?</span>
        </h1>
        <p class="ct-fade mt-6 max-w-2xl text-[clamp(1rem,2.6vw,1.28rem)] text-center mx-auto leading-relaxed text-white/80">
          Si te interesa ser parte, colaborar o simplemente saber más de Vikingas, escríbenos. Siempre hay espacio para sumar.
        </p>
      </div> 
    </div>

    <!-- Canales de contacto -->
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="ct-fade grid gap-6 md:grid-cols-2">

        <!-- Instagram -->
        <a
          href="https://instagram.com/cdvikingas"
          target="_blank"
          rel="noopener noreferrer"
          @click="trackOutboundClick('https://instagram.com/cdvikingas', 'Instagram contacto')"
          class="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/5 px-6 py-7 backdrop-blur-sm transition-all duration-300 hover:border-(--ct-primary)/30 hover:bg-white/8 sm:px-8"
        >
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--ct-primary)/14 transition-transform duration-300 group-hover:scale-110">
            <svg class="h-7 w-7 text-(--ct-primary)" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-[0.68rem] font-black uppercase tracking-[0.22em] text-(--ct-primary)">Instagram</span>
            <span class="mt-1 block text-xl font-black text-white sm:text-2xl">@cdvikingas</span>
            <span class="mt-1 block text-sm leading-relaxed text-white/60">Noticias, partidos, entrenamientos y el día a día del club.</span>
          </span>
          <svg class="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-(--ct-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <!-- Email -->
        <a
          href="mailto:cdvikingas@gmail.com"
          @click="trackOutboundClick('mailto:cdvikingas@gmail.com', 'Email contacto')"
          class="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/5 px-6 py-7 backdrop-blur-sm transition-all duration-300 hover:border-(--ct-primary)/30 hover:bg-white/8 sm:px-8"
        >
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--ct-primary)/14 transition-transform duration-300 group-hover:scale-110">
            <EnvelopeIcon class="h-7 w-7 text-(--ct-primary)" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-[0.68rem] font-black uppercase tracking-[0.22em] text-(--ct-primary)">Email</span>
            <span class="mt-1 block text-xl font-black text-white sm:text-2xl break-all">cdvikingas@gmail.com</span>
            <span class="mt-1 block text-sm leading-relaxed text-white/60">Consultas, colaboraciones y todo lo que necesites.</span>
          </span>
          <svg class="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-(--ct-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <!-- Formulario de contacto -->
      <div class="ct-fade mt-10 grid gap-8 rounded-4xl border border-(--ct-primary)/20 bg-white/5 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:p-10">
        <div>
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--ct-primary)">Escríbenos directo</p>
          <h2 class="mt-3 text-3xl font-black uppercase leading-none text-white sm:text-4xl" style="font-family: 'Gobold High', sans-serif;">Queremos conocerte</h2>
          <p class="mt-5 text-sm leading-7 text-white/65">Déjanos tus datos y cuéntanos qué te gustaría conversar. Te responderemos por el canal que te acomode.</p>
          <div class="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/8 p-4 text-sm text-white/75">
            <p class="font-black text-emerald-200">También puedes escribirnos por WhatsApp</p>
            <p class="mt-1">+56 9 8745 1232</p>
          </div>
        </div>

        <form class="grid gap-4" @submit.prevent="enviarFormulario">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
              Nombre *
              <input v-model.trim="formulario.nombre" required maxlength="80" type="text" autocomplete="given-name" class="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-(--ct-primary)" />
            </label>
            <label class="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
              Apellido *
              <input v-model.trim="formulario.apellido" required maxlength="80" type="text" autocomplete="family-name" class="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-(--ct-primary)" />
            </label>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
              WhatsApp *
              <input v-model.trim="formulario.whatsapp" required maxlength="40" type="tel" autocomplete="tel" placeholder="+56 9..." class="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-(--ct-primary)" />
            </label>
            <label class="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
              Correo <span class="normal-case tracking-normal text-white/35">(opcional)</span>
              <input v-model.trim="formulario.email" maxlength="160" type="email" autocomplete="email" class="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-(--ct-primary)" />
            </label>
          </div>

          <label class="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
            Instagram u otra red <span class="normal-case tracking-normal text-white/35">(opcional)</span>
            <input v-model.trim="formulario.redesSociales" maxlength="160" type="text" placeholder="@tuusuario o enlace" class="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-(--ct-primary)" />
          </label>

          <label class="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
            ¿Qué te gustaría conversar? *
            <select v-model="formulario.motivo" required class="rounded-xl border border-white/15 bg-[#10201e] px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-(--ct-primary)">
              <option disabled value="">Selecciona una opción</option>
              <option value="Quiero jugar">Quiero jugar</option>
              <option value="Quiero probar">Quiero probar</option>
              <option value="Consulta general">Consulta general</option>
              <option value="Patrocinio o colaboración">Patrocinio o colaboración</option>
              <option value="Prensa">Prensa</option>
            </select>
          </label>

          <label class="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/60">
            Mensaje *
            <textarea v-model.trim="formulario.mensaje" required maxlength="1200" rows="4" class="resize-y rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-(--ct-primary)"></textarea>
          </label>

          <input v-model="formulario.website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs leading-relaxed text-white/45">Usaremos estos datos solo para responderte sobre tu mensaje.</p>
            <button type="submit" :disabled="enviando" class="inline-flex items-center justify-center rounded-xl bg-(--ct-primary) px-5 py-3 text-sm font-black text-[#06201c] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              {{ enviando ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
          </div>

          <div v-if="enviado" class="rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-100">
            Recibimos tu mensaje. También puedes continuar la conversación directamente por WhatsApp.
            <a :href="enlaceWhatsapp" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex rounded-lg bg-emerald-400 px-3 py-2 text-xs font-black text-[#06201c]">Abrir WhatsApp</a>
          </div>
          <p v-if="errorFormulario" class="rounded-xl border border-red-300/25 bg-red-400/10 p-4 text-sm font-semibold text-red-100">{{ errorFormulario }}</p>
        </form>
      </div>

      <!-- Bloque invitación -->
      <div class="ct-fade mt-14 rounded-4xl border border-(--ct-primary)/20 bg-[linear-gradient(135deg,rgba(44,207,191,0.08),rgba(216,178,85,0.06))] px-6 py-10 text-center sm:px-10 lg:px-14 lg:py-14">
        <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--ct-primary)">Sumate al club</p>
        <h3 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-[0.94] text-white" style="font-family: 'Gobold High', sans-serif;">
          Siempre hay lugar para una más
        </h3>
        <p class="mx-auto mt-5 max-w-2xl text-[1rem] leading-8 text-white/72 sm:text-[1.05rem]">
          Si estás buscando un espacio donde volver a jugar, donde te reciban de verdad y donde el fútbol se vive con comunidad, Vikingas es tu lugar. No importa la edad, no importa el nivel. Importa que quieras estar.
        </p>
      </div>
    </div>

    <!-- Frase cierre -->
    <div class="ct-fade mx-auto max-w-7xl border-t border-white/10 px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
      <p class="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3.6rem)] font-black italic leading-tight text-white" style="font-family: 'Gobold High', sans-serif;">
        Contactanos. Acá siempre hay cancha, grupo y ganas de sumar.
      </p>
      <p class="mt-8 text-sm text-white/40">
        © 2026 Club Deportivo Social y Cultural Vikingas. Todos los derechos reservados.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { EnvelopeIcon } from '@heroicons/vue/24/solid';
import { trackOutboundClick } from '../composables/useAnalytics';
import { enviarMensajeContacto } from '../firebase/mensajesContacto';

const formularioInicial = () => ({
  nombre: '',
  apellido: '',
  whatsapp: '',
  email: '',
  redesSociales: '',
  motivo: '',
  mensaje: '',
  website: ''
});

const formulario = ref(formularioInicial());
const enviando = ref(false);
const enviado = ref(false);
const errorFormulario = ref('');
const enlaceWhatsapp = computed(() => {
  const texto = `Hola Vikingas, soy ${formulario.value.nombre} ${formulario.value.apellido}. Les escribí desde el formulario de contacto por: ${formulario.value.motivo}.`;
  return `https://wa.me/56987451232?text=${encodeURIComponent(texto)}`;
});

const enviarFormulario = async () => {
  if (enviando.value) return;

  enviando.value = true;
  enviado.value = false;
  errorFormulario.value = '';

  try {
    await enviarMensajeContacto(formulario.value);
    enviado.value = true;
    formulario.value = formularioInicial();
  } catch (error) {
    errorFormulario.value = error?.message?.includes('invalid-argument')
      ? 'Revisa los campos obligatorios e intenta nuevamente.'
      : 'No pudimos enviar tu mensaje. Intenta nuevamente o escríbenos por WhatsApp.';
  } finally {
    enviando.value = false;
  }
};
</script>

<style scoped>
.contacto-page {
  --ct-bg: #0b1112;
  --ct-primary: #2ccfbf;
  --ct-accent: #d8b255;
  --ct-text: #f7fffd;
}

.ct-fade {
  animation: ct-rise 0.8s ease-out both;
}

@keyframes ct-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ct-fade {
    animation: none;
  }
}
</style>

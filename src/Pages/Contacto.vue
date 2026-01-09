<template>
  <div class="w-full bg-black py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Título -->
      <h1 class="text-4xl font-bold text-primary mb-16 text-center">CONTACTO</h1>

      <!-- Grid de Contactos -->
      <div class="grid md:grid-cols-3 grid-cols-1 gap-12">
        <!-- WhatsApp -->
        <div class="flex flex-col items-center text-center space-y-4 pb-8 md:pb-0 md:border-r md:border-primary/30">
          <div class="text-primary">
            <PhoneIcon class="w-12 h-12 mx-auto" />
          </div>
          <h3 class="text-white text-lg font-bold uppercase tracking-wider">WhatsApp</h3>
          <a href="https://wa.me/56912341234" target="_blank" class="text-primary text-2xl font-bold hover:opacity-80 transition-opacity">
            +569 1234 1234
          </a>
        </div>

        <!-- Instagram -->
        <div class="flex flex-col items-center text-center space-y-4 pb-8 md:pb-0 md:border-r md:border-primary/30">
          <div class="text-primary">
            <GlobeAltIcon class="w-12 h-12 mx-auto" />
          </div>
          <h3 class="text-white text-lg font-bold uppercase tracking-wider">Instagram</h3>
          <a href="https://instagram.com/cdvikingas" target="_blank" class="text-primary text-2xl font-bold hover:opacity-80 transition-opacity">
            @CDVIKINGAS
          </a>
        </div>

        <!-- Email -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="text-primary">
            <EnvelopeIcon class="w-12 h-12 mx-auto" />
          </div>
          <h3 class="text-white text-lg font-bold uppercase tracking-wider">Email</h3>
          <a href="mailto:cdvikingas@gmail.com" class="text-primary text-2xl font-bold hover:opacity-80 transition-opacity break-all">
            CDVIKINGAS@gmail.com
          </a>
        </div>
      </div>

      <!-- Línea separadora -->
      <div class="border-t border-primary/30 mt-16 pt-8">
        <p class="text-white/60 text-center text-sm">
            © 2025 Club Deportivo Vikingas. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhoneIcon, GlobeAltIcon, EnvelopeIcon } from '@heroicons/vue/24/solid';
</script>

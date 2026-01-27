<template>
  <div class="w-full bg-black py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Título -->
      <h1 class="text-4xl font-bold text-primary mb-16 text-center">CONTACTO</h1>

      <!-- Grid de Contactos -->
      <div class="grid md:grid-cols-3 grid-cols-1 gap-12">
       

        <!-- Instagram -->
        <div class="flex flex-col items-center text-center space-y-4 pb-8 md:pb-0 md:border-r md:border-primary/30">
          <div class="text-primary">
          <svg class="w-10 h-10 " fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
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

<template>
    <SliderHome />
    
    <!-- Banner de Campeonato -->
    <div class="bg-linear-to-r from-primary via-yellow-400 to-primary py-3 px-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnptMC0zNGMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyem0wIDY4YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <!-- Icono de trofeo -->
          <div class="shrink-0">
            <svg class="w-14 h-14 md:w-20 md:h-20 text-black animate-bounce" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          
          <!-- Contenido principal -->
          <div class="text-center md:text-left">
            <h2 class="text-2xl md:text-4xl font-black text-black mb-1 uppercase" style="font-family: 'Gobold High', sans-serif;">
              ¡Campeonas Serie AB+ COPA ORO!
            </h2>
            <p class="text-black/90 font-bold text-sm md:text-base mb-2">
              Vikingas Ascenso - Liga de Verano 2026
            </p>
            <p class="text-black/70 text-xs md:text-sm font-semibold">
              Victoria en final 4-2 vs Firegol | Semifinal 7-2 vs Clever
            </p>
          </div>
          
          <!-- CTA Button -->
          <div class="shrink-0">
            <router-link
              to="/competencias"
              class="inline-block bg-black hover:bg-gray-900 text-primary px-6 py-3 rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-xl"
            >
              Ver Resultados →
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Botón de acceso para jugadoras -->
    <div class="bg-linear-to-r from-black via-primary to-black  py-8 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-xl font-bold text-white mb-4">
          ¿Eres jugadora del club?
        </h2>
        <p class="text-white/90 mb-6 text-md">
          Accede a tu perfil, revisa entrenamientos y confirma tu asistencia
        </p>
        <router-link
          to="/login-jugadora"
          class="inline-block bg-white text-primary-dark px-8 py-4 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
        >
          Acceso Jugadoras 
        </router-link>
      </div>
    </div>
    
    <Eventos />
</template>

<script setup>

import SliderHome from '../components/SliderHome.vue';
import Eventos from '../components/Eventos.vue';
import AccesoJugadoras from '../components/AccesoJugadoras.vue';

</script>
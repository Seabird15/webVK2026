<template>
    <SliderHome />
    
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
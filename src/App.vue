<script setup>
    import Nav from './components/Nav.vue';
    import Loader from './components/Loader.vue';
    import Footer from './components/Footer.vue';

    import { watch, onMounted } from 'vue';
import { jugadoraData, authReady, obtenerEquiposJugadoraDesdeDatos, obtenerEquipoJugadora } from './firebase/jugadorasAuth'; // Importar authReady
import { requestPermissionAndSubscribe } from './firebase/messaging'; // La función que creamos

const suscribirTemasJugadora = (data) => {
  const equipos = obtenerEquiposJugadoraDesdeDatos(data);
  if (!equipos.length) {
    return;
  }

  const temas = new Set(equipos);
  if (obtenerEquipoJugadora() === 'ambos') {
    temas.add('ambos');
  }

  temas.forEach((tema) => {
    requestPermissionAndSubscribe(tema);
  });
};

// Ejecutar al montar el componente si ya hay datos de jugadora
onMounted(() => {
  // Esperar a que la autenticación esté lista
  const checkAndSubscribe = () => {
    if (authReady.value && jugadoraData.value) {
      suscribirTemasJugadora(jugadoraData.value);
    } else {
    }
  };
  
  // Intentar inmediatamente
  checkAndSubscribe();
  
  // Y también observar cambios en authReady por si aún no está listo
  watch(authReady, (ready) => {
    if (ready) {
      checkAndSubscribe();
    }
  }, { immediate: true });
});

watch(jugadoraData, (newData, oldData) => {
  if (newData) {
    const equiposNuevos = obtenerEquiposJugadoraDesdeDatos(newData).join(',');
    const equiposAnteriores = obtenerEquiposJugadoraDesdeDatos(oldData).join(',');
    
    if (!oldData || equiposNuevos !== equiposAnteriores || newData.categoriaSeleccionada !== oldData?.categoriaSeleccionada) {
      suscribirTemasJugadora(newData);
    }
  }
}, { 
  deep: true // 'deep' es mejor para observar cambios dentro de un objeto
});
</script>

<template>
  <div class="bg-black min-h-screen">
    <Nav />
    <Loader />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped>

</style>

<script setup>
    import Nav from './components/Nav.vue';
    import Loader from './components/Loader.vue';
    import Footer from './components/Footer.vue';

    import { watch, onMounted } from 'vue';
import { jugadoraData, authReady } from './firebase/jugadorasAuth'; // Importar authReady
import { requestPermissionAndSubscribe } from './firebase/messaging'; // La función que creamos

// Ejecutar al montar el componente si ya hay datos de jugadora
onMounted(() => {
  // Esperar a que la autenticación esté lista
  const checkAndSubscribe = () => {
    if (authReady.value && jugadoraData.value && jugadoraData.value.equipo) {
      console.log(`App montada con datos de jugadora. Equipo: ${jugadoraData.value.equipo}. Suscribiendo...`);
      requestPermissionAndSubscribe(jugadoraData.value.equipo);
      
      if (jugadoraData.value.equipo === 'ambos') {
        requestPermissionAndSubscribe('ascenso');
        requestPermissionAndSubscribe('escuela');
      }
    } else {
      console.log('Esperando auth o datos de jugadora...', { authReady: authReady.value, hasData: !!jugadoraData.value });
    }
  };
  
  // Intentar inmediatamente
  checkAndSubscribe();
  
  // Y también observar cambios en authReady por si aún no está listo
  watch(authReady, (ready) => {
    if (ready) {
      console.log('Auth ready - verificando suscripción');
      checkAndSubscribe();
    }
  }, { immediate: true });
});

watch(jugadoraData, (newData, oldData) => {
  // Solo proceder si tenemos nuevos datos y esos datos tienen un 'equipo'
  // y además, nos aseguramos de que no sea una ejecución inicial con datos vacíos.
  if (newData && newData.equipo) {
    
    // Para evitar ejecuciones múltiples, solo suscribimos si el equipo ha cambiado
    // o si antes no había datos y ahora sí.
    if (!oldData || newData.equipo !== oldData.equipo) {
      
      console.log(`Datos de jugadora actualizados. Equipo: ${newData.equipo}. Intentando suscribir...`);
      
      // Llama a la función para suscribirla al tema de su equipo
      requestPermissionAndSubscribe(newData.equipo);

      // Si una jugadora puede pertenecer a "ambos" equipos
      if (newData.equipo === 'ambos') {
          requestPermissionAndSubscribe('ascenso');
          requestPermissionAndSubscribe('escuela');
      }
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

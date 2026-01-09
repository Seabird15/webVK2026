<script setup>
    import Nav from './components/Nav.vue';
    import Loader from './components/Loader.vue';
    import Footer from './components/Footer.vue';
  
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

<template>
  <footer class="bg-black text-white py-12">
    <!-- Sponsors Section -->
    <div class=" mx-auto">
      <!-- First Row of Sponsors -->
      <div class="flex justify-center items-center gap-8 mb-12 flex-wrap">
        <img src="@/assets/sponsors/sponsors.png" alt="Sponsors" class="h-20 object-contain" />
      </div>

      <!-- Second Row with Alianza and Spirit Sport -->
      <div class="flex justify-between items-center gap-8 px-8">
        <!-- Left spacer -->
        <div class="flex-1"></div>

        <!-- Center - Main Logo -->
        <div class="flex justify-center w-36">
          <img src="@/assets/logoVk.png" alt="Club Deportivo Vikingas" class="h-10 object-contain" />
        </div>

        <!-- Right section with Alianza and Spirit -->
        <div class="flex-1 flex justify-end items-center gap-12">
          <div class="text-right">
            <h3 class="text-xl font-bold mb-2">ALIANZA</h3>
          </div>
          <img src="@/assets/sponsors/spirit.png" alt="Spirit Sport" class=" w-24 h-20 object-contain" />
        </div>
      </div>
    </div>

    <!-- Bottom border line -->
    <div class="border-t border-gray-700 mt-12 pt-6">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
        <p>&copy; 2026 Club Deportivo Vikingas. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineOptions({
  name: "Footer"
});
</script>

<style scoped>
footer {
  background-color: #000;
}

img {
  max-width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  footer .flex {
    flex-direction: column;
    gap: 4rem;
  }

  .flex-1 {
    width: 100%;
  }
}
</style>

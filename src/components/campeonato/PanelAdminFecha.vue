<template>
  <div class="mb-6 bg-primary/20 border-2 border-primary rounded-lg p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-primary font-bold text-sm flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
        MODO EDICIÓN (ADMIN)
      </h3>
      <span v-if="guardando" class="text-xs bg-black/30 text-primary px-2 py-1 rounded flex items-center gap-1">
        <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Guardando...
      </span>
    </div>
    <p class="text-primary/80 text-xs">Haz clic en "Editar Goleadoras" para gestionar los goles en tiempo real</p>
  </div>
</template>

<script setup>
defineProps({
  guardando: {
    type: Boolean,
    default: false
  }
});
</script>

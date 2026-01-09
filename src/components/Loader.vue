<template>
    <!-- Overlay Loader -->
    <transition name="fade">
        <div v-if="isLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <!-- Contenedor del Loader -->
            <div class="flex flex-col items-center space-y-6">
                <!-- Logo con Pulsación -->
                <div class="pulse-slow">
                    <img 
                        src="@/assets/logoVk.png" 
                        alt="Vikingas" 
                        class="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
                    />
                </div>

                <!-- Mensaje de Carga -->
                <p v-if="loadingMessage" class="text-white text-lg font-semibold tracking-wider text-center">
                    {{ loadingMessage }}
                </p>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { useLoader } from '../composables/useLoader.js';

const { isLoading, loadingMessage } = useLoader();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Efecto de pulsación lenta */
@keyframes pulse-slow {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.05);
    }
}

.pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

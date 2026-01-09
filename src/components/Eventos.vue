<template>
    <div class="w-full py-12 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="grid lg:grid-cols-5 grid-cols-1 gap-8">
                <!-- Próximo Partido -->
                <div class="col-span-2 border-5 border-primary-dark bg-black/50 p-8 rounded-lg">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-white font-bold text-lg tracking-wide">PRÓXIMO PARTIDO</h2>
                        <span class="text-primary text-2xl">→</span>
                    </div>

                    <div v-if="proximoPartido" class="space-y-6">
                        <!-- Fecha y Liga -->
                        <div class="text-center space-y-1">
                            <p class="text-white text-sm uppercase">{{ proximoPartido.fecha }}</p>
                            <p class="text-white/70 text-xs uppercase">{{ proximoPartido.liga }}</p>
                        </div>

                        <!-- Equipos -->
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col items-center gap-2">
                                <img src="../assets/logoVK.png" :alt="proximoPartido.equipo1.nombre"
                                    class="w-16 h-16">
                                <p class="text-white text-sm font-bold">{{ proximoPartido.equipo1.nombre }}</p>
                            </div>

                            <div class="text-center p-4 bg-primary">
                                <p class=" text-xs font-bold">{{ proximoPartido.hora }}</p>
                                <p class=" text-xs mt-1 font-bold">PM</p>
                            </div>

                            <div class="flex flex-col items-center gap-2">
                                <p class="text-white text-sm font-bold">{{ proximoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Logo Vikingas Centro -->
                <div class="hidden lg:block ">
                    <div class="col-span-1 flex items-center justify-center">
                        <img src="https://firebasestorage.googleapis.com/v0/b/fitapp-4fa5d.firebasestorage.app/o/VIKINGAS.svg?alt=media&token=9d4b0792-2e5a-4fe5-a1b7-f9f34a3b9099"
                            alt="Vikingas" class="h-32 w-auto">
                    </div>
                </div>
                    <p class="block lg:hidden font-bold text-white text-center text-4xl tracking-wider">VIKINGAS</p>



                <!-- Último Partido -->
                <div class="col-span-2 border-5 border-primary bg-black/50 p-8 rounded-lg">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-white font-bold text-lg tracking-wide">ÚLTIMO PARTIDO</h2>
                        <span class="text-primary text-2xl">→</span>
                    </div>

                    <div v-if="ultimoPartido" class="space-y-6">
                        <!-- Fecha y Liga -->
                        <div class="text-center space-y-1">
                            <p class="text-white text-sm uppercase">{{ ultimoPartido.fecha }}</p>
                            <p class="text-white/70 text-xs uppercase">{{ ultimoPartido.liga }}</p>
                        </div>

                        <!-- Equipos y Resultado -->
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col items-center gap-2">
                                <img src="../assets/logoVK.png" :alt="ultimoPartido.equipo1.nombre"
                                    class="w-16 h-16">
                                <p class="text-white text-sm font-bold">{{ ultimoPartido.equipo1.nombre }}</p>
                            </div>

                            <div class="text-center space-y-2">
                                <div class="flex gap-2 justify-center">
                                    <span class="bg-primary text-black font-bold px-3 py-1 rounded text-lg">{{
                                        ultimoPartido.resultado.equipo1 }}</span>
                                    <span class="text-white/50">-</span>
                                    <span class="bg-primary text-black font-bold px-3 py-1 rounded text-lg">{{
                                        ultimoPartido.resultado.equipo2 }}</span>
                                </div>
                            </div>

                            <div class="flex flex-col items-center gap-2">
                                <p class="text-white text-sm font-bold">{{ ultimoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { obtenerEventosEspeciales } from '../firebase/eventosEspeciales.js';

const proximoPartido = ref(null);
const ultimoPartido = ref(null);
const cargando = ref(true);

onMounted(async () => {
    try {
        const datos = await obtenerEventosEspeciales();
        proximoPartido.value = datos.proximoPartido;
        ultimoPartido.value = datos.ultimoPartido;
    } catch (error) {
        console.error('Error cargando eventos especiales:', error);
    } finally {
        cargando.value = false;
    }
});
</script>
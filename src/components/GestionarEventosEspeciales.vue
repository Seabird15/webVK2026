<template>
    <div class="space-y-8">
        <!-- Sección Próximo Partido -->
        <div class="bg-white/10 border border-primary/30 rounded-lg p-6">
            <h3 class="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <span class="text-primary">→</span> PRÓXIMO PARTIDO
            </h3>

            <div class="space-y-4">
                <!-- Fecha -->
                <div>
                    <label class="block text-white text-sm font-semibold mb-2">Fecha</label>
                    <input
                        v-model="formProximo.fecha"
                        type="text"
                        placeholder="Ej: MARTES 30 DICIEMBRE"
                        class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                    />
                </div>

                <!-- Liga -->
                <div>
                    <label class="block text-white text-sm font-semibold mb-2">Liga</label>
                    <input
                        v-model="formProximo.liga"
                        type="text"
                        placeholder="Ej: AMISTOSO"
                        class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                    />
                </div>

                <!-- Hora -->
                <div>
                    <label class="block text-white text-sm font-semibold mb-2">Hora</label>
                    <input
                        v-model="formProximo.hora"
                        type="text"
                        placeholder="Ej: 21:00 HRS"
                        class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                    />
                </div>

                <!-- Equipo 1 (Vikingas - Logo Fijo) -->
                <div class="border-t border-primary/20 pt-4 mt-4">
                    <h4 class="text-primary text-sm font-bold mb-3">Equipo 1 (Vikingas)</h4>
                    <p class="text-white/70 text-xs">El logo de Vikingas es fijo y no necesita configuración</p>
                </div>

                <!-- Equipo 2 -->
                <div class="border-t border-primary/20 pt-4 mt-4">
                    <h4 class="text-primary text-sm font-bold mb-3">Equipo 2</h4>

                    <div>
                        <label class="block text-white text-sm font-semibold mb-2">Nombre</label>
                        <input
                            v-model="formProximo.equipo2.nombre"
                            type="text"
                            placeholder="Ej: Leyendas"
                            class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <!-- Botón Guardar -->
                <button
                    @click="guardarProximoPartido"
                    class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-2 rounded transition-colors mt-6"
                >
                    Guardar Próximo Partido
                </button>
            </div>
        </div>

        <!-- Sección Último Partido -->
        <div class="bg-white/10 border border-primary/30 rounded-lg p-6">
            <h3 class="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <span class="text-primary">→</span> ÚLTIMO PARTIDO
            </h3>

            <div class="space-y-4">
                <!-- Fecha -->
                <div>
                    <label class="block text-white text-sm font-semibold mb-2">Fecha</label>
                    <input
                        v-model="formUltimo.fecha"
                        type="text"
                        placeholder="Ej: MARTES 23 DICIEMBRE"
                        class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                    />
                </div>

                <!-- Liga -->
                <div>
                    <label class="block text-white text-sm font-semibold mb-2">Liga</label>
                    <input
                        v-model="formUltimo.liga"
                        type="text"
                        placeholder="Ej: AMISTOSO"
                        class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                    />
                </div>

                <!-- Equipo 1 (Vikingas - Logo Fijo) -->
                <div class="border-t border-primary/20 pt-4 mt-4">
                    <h4 class="text-primary text-sm font-bold mb-3">Equipo 1 (Vikingas)</h4>
                    <p class="text-white/70 text-xs">El logo de Vikingas es fijo y no necesita configuración</p>
                </div>

                <!-- Equipo 2 -->
                <div class="border-t border-primary/20 pt-4 mt-4">
                    <h4 class="text-primary text-sm font-bold mb-3">Equipo 2</h4>

                    <div class="mb-3">
                        <label class="block text-white text-sm font-semibold mb-2">Nombre</label>
                        <input
                            v-model="formUltimo.equipo2.nombre"
                            type="text"
                            placeholder="Ej: LAS K"
                            class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <!-- Resultado -->
                <div class="border-t border-primary/20 pt-4 mt-4">
                    <h4 class="text-primary text-sm font-bold mb-3">Resultado</h4>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-white text-sm font-semibold mb-2">Sets Equipo 1</label>
                            <input
                                v-model.number="formUltimo.resultado.equipo1"
                                type="number"
                                min="0"
                                class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label class="block text-white text-sm font-semibold mb-2">Sets Equipo 2</label>
                            <input
                                v-model.number="formUltimo.resultado.equipo2"
                                type="number"
                                min="0"
                                class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                <!-- Botón Guardar -->
                <button
                    @click="guardarUltimoPartido"
                    class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-2 rounded transition-colors mt-6"
                >
                    Guardar Último Partido
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    obtenerEventosEspeciales,
    actualizarProximoPartido,
    actualizarUltimoPartido,
    inicializarEventosEspeciales
} from '../firebase/eventosEspeciales.js';
import { useLoader } from '../composables/useLoader.js';

const { show, hide } = useLoader();

const formProximo = ref({
    fecha: '',
    liga: '',
    hora: '',
    equipo1: {
        nombre: 'VIKINGAS'
    },
    equipo2: {
        nombre: ''
    }
});

const formUltimo = ref({
    fecha: '',
    liga: '',
    equipo1: {
        nombre: 'VIKINGAS'
    },
    equipo2: {
        nombre: ''
    },
    resultado: {
        equipo1: 0,
        equipo2: 0
    }
});

// Cargar datos al montar
onMounted(async () => {
    try {
        show('Cargando eventos especiales...');
        await inicializarEventosEspeciales();
        const datos = await obtenerEventosEspeciales();

        if (datos.proximoPartido) {
            formProximo.value = { ...datos.proximoPartido };
        }

        if (datos.ultimoPartido) {
            formUltimo.value = { ...datos.ultimoPartido };
        }

        hide();
    } catch (error) {
        hide();
        console.error('Error cargando eventos especiales:', error);
        alert('Error al cargar los datos');
    }
});

const manejarCargaLogo = async (event, equipo, tipo = 'proximo') => {
    // Función removida - el logo de Vikingas es fijo
};

const guardarProximoPartido = async () => {
    try {
        show('Guardando próximo partido...');

        await actualizarProximoPartido(formProximo.value);

        hide();
        alert('✓ Próximo partido guardado correctamente');
    } catch (error) {
        hide();
        console.error('Error guardando próximo partido:', error);
        alert('Error al guardar');
    }
};

const guardarUltimoPartido = async () => {
    try {
        show('Guardando último partido...');

        await actualizarUltimoPartido(formUltimo.value);

        hide();
        alert('✓ Último partido guardado correctamente');
    } catch (error) {
        hide();
        console.error('Error guardando último partido:', error);
        alert('Error al guardar');
    }
};
</script>

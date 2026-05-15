<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 pb-4 border-b border-gray-200">
      <div class="w-10 h-10 bg-linear-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
        <TrophyIcon class="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 class="text-2xl font-black text-gray-900">Campeonato Vikingas 4ta</h2>
        <p class="text-sm text-gray-600">Editor de resultados en tiempo real</p>
      </div>
    </div>

    <!-- Sub-tabs para secciones -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        v-for="section in sections"
        :key="section.id"
        @click="activeSection = section.id"
        :class="[
          'px-4 py-3 font-bold text-sm border-b-2 transition-all',
          activeSection === section.id
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ section.label }}
      </button>
    </div>

    <!-- Sección: Programación -->
    <div v-if="activeSection === 'programacion'" class="space-y-4">
      <div class="grid gap-4 lg:grid-cols-3">
        <article
          v-for="bloque in programacionCompleta.filter(b => !b.esDescanso)"
          :key="bloque.id"
          class="rounded-2xl border border-gray-200 bg-white p-5 space-y-4 hover:shadow-lg transition-shadow"
        >
          <!-- Header del bloque -->
          <div class="pb-3 border-b border-gray-100">
            <p class="text-xs font-black uppercase tracking-wider text-primary">{{ bloque.horario }}</p>
            <p class="text-sm font-bold text-gray-900 mt-1">{{ bloque.titulo }}</p>
          </div>

          <!-- Cancha 1 -->
          <div class="space-y-2">
            <p class="text-xs font-bold uppercase text-gray-600">Cancha 1</p>
            <div class="flex items-center gap-2 mb-3">
              <img :src="getLogoEquipo(bloque.cancha1.split(' vs ')[0])" :alt="bloque.cancha1" class="h-10 w-10 object-contain" />
              <span class="text-xs font-bold">VS</span>
              <img :src="getLogoEquipo(bloque.cancha1.split(' vs ')[1])" :alt="bloque.cancha1" class="h-10 w-10 object-contain" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input
                :value="resultados.get(`${bloque.id}-cancha1`)?.golesLocal ?? 0"
                @input="(e) => setGoles(bloque.id, 'cancha1', 'local', Number(e.target.value))"
                type="number"
                min="0"
                placeholder="Goles"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-primary"
              />
              <input
                :value="resultados.get(`${bloque.id}-cancha1`)?.golesVisita ?? 0"
                @input="(e) => setGoles(bloque.id, 'cancha1', 'visita', Number(e.target.value))"
                type="number"
                min="0"
                placeholder="Goles"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-primary"
              />
            </div>
            <p class="text-xs text-gray-600">{{ bloque.cancha1 }}</p>
          </div>

          <!-- Cancha 2 -->
          <div class="space-y-2 pt-2 border-t border-gray-100">
            <p class="text-xs font-bold uppercase text-gray-600">Cancha 2</p>
            <div class="flex items-center gap-2 mb-3">
              <img :src="getLogoEquipo(bloque.cancha2.split(' vs ')[0])" :alt="bloque.cancha2" class="h-10 w-10 object-contain" />
              <span class="text-xs font-bold">VS</span>
              <img :src="getLogoEquipo(bloque.cancha2.split(' vs ')[1])" :alt="bloque.cancha2" class="h-10 w-10 object-contain" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input
                :value="resultados.get(`${bloque.id}-cancha2`)?.golesLocal ?? 0"
                @input="(e) => setGoles(bloque.id, 'cancha2', 'local', Number(e.target.value))"
                type="number"
                min="0"
                placeholder="Goles"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-primary"
              />
              <input
                :value="resultados.get(`${bloque.id}-cancha2`)?.golesVisita ?? 0"
                @input="(e) => setGoles(bloque.id, 'cancha2', 'visita', Number(e.target.value))"
                type="number"
                min="0"
                placeholder="Goles"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-primary"
              />
            </div>
            <p class="text-xs text-gray-600">{{ bloque.cancha2 }}</p>
          </div>

          <!-- Botón Finalizar -->
          <div class="pt-4 border-t border-gray-100">
            <button
              @click="finalizarBloque(bloque.id)"
              :class="[
                'w-full px-4 py-2 rounded-lg font-bold text-sm transition-all',
                (resultados.get(`${bloque.id}-cancha1`)?.finalizado && resultados.get(`${bloque.id}-cancha2`)?.finalizado)
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-primary text-white hover:bg-opacity-90'
              ]"
            >
              {{ (resultados.get(`${bloque.id}-cancha1`)?.finalizado && resultados.get(`${bloque.id}-cancha2`)?.finalizado) ? '✓ Finalizado' : 'Finalizar' }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <!-- Sección: Tabla de Posiciones -->
    <div v-if="activeSection === 'tabla'" class="space-y-4">
      <div class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-black uppercase text-gray-900">Equipo</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-gray-900">PJ</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-gray-900">PG</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-gray-900">PE</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-gray-900">PP</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-gray-900">GF</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-gray-900">GC</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-amber-600">DG</th>
              <th class="px-4 py-3 text-center text-xs font-black uppercase text-primary">PTS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(equipo, idx) in tablaPosicionesCalculada"
              :key="equipo.equipo"
              :class="[
                'hover:bg-gray-50 transition-colors',
                idx === 0 && 'bg-green-50',
                idx === 1 && 'bg-blue-50',
                idx === 2 && 'bg-amber-50'
              ]"
            >
              <td class="px-4 py-3 text-sm font-bold text-gray-900">{{ idx + 1 }}. {{ equipo.equipo }}</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-gray-600">{{ equipo.pj }}</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-green-600">{{ equipo.pg }}</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-amber-600">{{ equipo.pe }}</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-red-600">{{ equipo.pp }}</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-gray-600">{{ equipo.gf }}</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-gray-600">{{ equipo.gc }}</td>
              <td class="px-4 py-3 text-center text-sm font-bold text-amber-600">{{ equipo.gf - equipo.gc }}</td>
              <td class="px-4 py-3 text-center text-sm font-black text-primary">{{ equipo.pts }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sección: Goleadoras -->
    <div v-if="activeSection === 'goleadoras'" class="space-y-6">
      <!-- Formulario para agregar goleadora -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">Registrar Goleadora</h3>
        
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Equipo</label>
            <select
              v-model="formGoleadora.equipo"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary font-bold"
            >
              <option value="">-- Seleccionar equipo --</option>
              <option v-for="eq in equiposParticipantes" :key="eq.nombre" :value="eq.nombre">
                {{ eq.nombre }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Jugadora</label>
            <input
              v-model="formGoleadora.jugadora"
              type="text"
              placeholder="Nombre de la jugadora"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary font-bold"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Goles</label>
            <input
              v-model.number="formGoleadora.goles"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary font-bold text-center"
            />
          </div>
        </div>

        <button
          @click="agregarGoleadora"
          :disabled="!formGoleadora.equipo || !formGoleadora.jugadora || formGoleadora.goles < 0"
          class="w-full px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar Goleadora
        </button>
      </div>

      <!-- Lista de goleadoras -->
      <div v-if="goleadoras.length > 0" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-900">Goleadoras Registradas</h3>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(gol, idx) in goleadoras"
            :key="idx"
            class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition space-y-3"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="font-bold text-gray-900">{{ gol.jugadora }}</p>
                <p class="text-sm text-gray-600">{{ gol.equipo }}</p>
              </div>
              <button
                @click="goleadoras.splice(idx, 1)"
                class="text-red-600 hover:text-red-800 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <!-- Contador de goles -->
            <div class="flex items-center justify-center gap-3 bg-gray-50 rounded-lg p-3">
              <button
                @click="decrementarGoles(idx)"
                class="w-8 h-8 flex items-center justify-center bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
              >
                −
              </button>
              <span class="text-2xl font-black text-primary w-12 text-center">{{ gol.goles }}</span>
              <button
                @click="incrementarGoles(idx)"
                class="w-8 h-8 flex items-center justify-center bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
        <p class="text-gray-600 font-bold">No hay goleadoras registradas aún</p>
      </div>
    </div>

    <!-- Botones de control de campeonato -->
    <div class="mt-8 pt-6 border-t border-gray-200 flex gap-3 justify-end">
      <button
        @click="guardarManualmente"
        class="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
      >
        💾 Guardar Ahora
      </button>
      <button
        @click="reiniciar"
        class="px-6 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition"
      >
        🔄 Reiniciar
      </button>
      <button
        @click="confirmarEliminarCampeonato"
        class="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
      >
        🗑️ Eliminar Todo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { TrophyIcon } from '@heroicons/vue/24/solid'
import { 
  guardarCampeonatoFirestore, 
  cargarCampeonatoFirestore, 
  limpiarCampeonatoFirestore 
} from '../firebase/campeonato4ta'
import logoVikingas from '../assets/logoVk.png'
import logoZorzales from '../assets/logos/zorzaleslogo.webp'
import logoOdiosas from '../assets/logos/odiosas.jpg'
import logoFenix from '../assets/logos/fenix.png'
import logoPonshi from '../assets/logos/logoponshi.jpg'

const activeSection = ref('programacion')

const sections = [
  { id: 'programacion', label: 'Programación' },
  { id: 'tabla', label: 'Tabla de Posiciones' },
  { id: 'goleadoras', label: 'Goleadoras' }
]

const equiposParticipantes = [
  { nombre: 'Vikingas Formativo', logo: logoVikingas },
  { nombre: 'Zorzales FC', logo: logoZorzales },
  { nombre: 'Fenix', logo: logoFenix },
  { nombre: "O'Diosas FC", logo: logoOdiosas },
  { nombre: 'PonchiCrack', logo: logoPonshi },
]

const getLogoEquipo = (nombreEquipo) => {
  const equipo = equiposParticipantes.find(e => 
    e.nombre.toLowerCase().includes(nombreEquipo.toLowerCase()) || 
    nombreEquipo.toLowerCase().includes(e.nombre.toLowerCase())
  )
  return equipo?.logo
}

// Estado para resultados
const resultados = ref(new Map())

// Estado para goleadoras
const goleadoras = ref([])
const formGoleadora = ref({
  equipo: '',
  jugadora: '',
  goles: 0
})

// Función para agregar goleadora
const agregarGoleadora = () => {
  if (formGoleadora.value.equipo && formGoleadora.value.jugadora) {
    goleadoras.value.push({
      equipo: formGoleadora.value.equipo,
      jugadora: formGoleadora.value.jugadora,
      goles: formGoleadora.value.goles || 0
    })
    formGoleadora.value.equipo = ''
    formGoleadora.value.jugadora = ''
    formGoleadora.value.goles = 0
    console.log('✅ Goleadora agregada:', goleadoras.value)
  }
}

// Funciones para incrementar/decrementar goles
const incrementarGoles = (idx) => {
  if (goleadoras.value[idx]) {
    goleadoras.value[idx].goles++
  }
}

const decrementarGoles = (idx) => {
  if (goleadoras.value[idx] && goleadoras.value[idx].goles > 0) {
    goleadoras.value[idx].goles--
  }
}

// Datos de programación
const programacionCompleta = [
  {
    id: 1,
    horario: '16:00 - 16:30',
    titulo: 'Fecha 1',
    cancha1: 'Vikingas Formativo vs O\'diosas',
    cancha2: 'Ponchicrack vs Fenix',
    libre: 'Zorzales',
  },
  {
    id: 2,
    horario: '16:40 - 17:10',
    titulo: 'Descanso',
    esDescanso: true,
  },
  {
    id: 3,
    horario: '17:10 - 17:40',
    titulo: 'Fecha 2',
    cancha1: 'Vikingas Formativo vs Fenix',
    cancha2: 'Zorzales vs O\'diosas',
    libre: 'Ponchicrack',
  },
  {
    id: 4,
    horario: '17:50 - 18:20',
    titulo: 'Fecha 3',
    cancha1: 'Vikingas Formativo vs Zorzales',
    cancha2: 'Ponchicrack vs O\'diosas',
    libre: 'Fenix',
  },
  {
    id: 5,
    horario: '18:30 - 19:00',
    titulo: 'Descanso',
    esDescanso: true,
  },
  {
    id: 6,
    horario: '19:00 - 19:30',
    titulo: 'Fecha 4',
    cancha1: 'Vikingas Formativo vs Ponchicrack',
    cancha2: 'Fenix vs Zorzales',
    libre: 'O\'Diosas',
  },
  {
    id: 7,
    horario: '19:40 - 20:10',
    titulo: 'Fecha 5',
    cancha1: 'Fenix vs O\'diosas',
    cancha2: 'Zorzales vs Ponchicrack',
    libre: 'Vikingas Formativo',
  },
]

const setGoles = (bloqueId, cancha, tipo, valor) => {
  const clave = `${bloqueId}-${cancha}`
  const res = resultados.value.get(clave)
  if (res) {
    if (tipo === 'local') {
      res.golesLocal = valor
    } else {
      res.golesVisita = valor
    }
  }
}

const finalizarBloque = (bloqueId) => {
  const cancha1Res = resultados.value.get(`${bloqueId}-cancha1`)
  const cancha2Res = resultados.value.get(`${bloqueId}-cancha2`)
  
  if (cancha1Res) cancha1Res.finalizado = true
  if (cancha2Res) cancha2Res.finalizado = true
  
  // Forzar reactividad: recrear el Map para que Vue detecte el cambio
  resultados.value = new Map(resultados.value)
  
  console.log(`✅ Bloque ${bloqueId} finalizado. Resultados actualizados.`)
}

// Encontrar equipo por nombre fuzzy matching
const encontrarEquipo = (nombreBuscado) => {
  return equiposParticipantes.find(e =>
    e.nombre.toLowerCase().includes(nombreBuscado.toLowerCase()) ||
    nombreBuscado.toLowerCase().includes(e.nombre.toLowerCase())
  )
}

const tablaPosicionesCalculada = computed(() => {
  const tabla = new Map()
  
  equiposParticipantes.forEach(eq => {
    tabla.set(eq.nombre, {
      equipo: eq.nombre,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      pts: 0
    })
  })

  // Procesar todos los resultados
  resultados.value.forEach(resultado => {
    if (!resultado.finalizado) return
    
    const matchup = resultado.matchup
    const [localNombre, visitaNombre] = matchup.split(' vs ').map(t => t.trim())
    const golesLocal = resultado.golesLocal || 0
    const golesVisita = resultado.golesVisita || 0

    // Encontrar equipos con fuzzy matching
    const equipoLocal = encontrarEquipo(localNombre)
    const equipoVisita = encontrarEquipo(visitaNombre)
    
    if (!equipoLocal || !equipoVisita) {
      console.warn(`Equipos no encontrados: ${localNombre} vs ${visitaNombre}`)
      return
    }

    const localStats = tabla.get(equipoLocal.nombre)
    const visitaStats = tabla.get(equipoVisita.nombre)

    if (localStats && visitaStats) {
      // Actualizar partidos jugados
      localStats.pj += 1
      visitaStats.pj += 1

      // Actualizar goles
      localStats.gf += golesLocal
      localStats.gc += golesVisita
      visitaStats.gf += golesVisita
      visitaStats.gc += golesLocal

      // Calcular resultado
      if (golesLocal > golesVisita) {
        localStats.pg += 1
        localStats.pts += 3
        visitaStats.pp += 1
      } else if (golesLocal < golesVisita) {
        visitaStats.pg += 1
        visitaStats.pts += 3
        localStats.pp += 1
      } else {
        localStats.pe += 1
        localStats.pts += 1
        visitaStats.pe += 1
        visitaStats.pts += 1
      }
    }
  })

  return [...tabla.values()].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    return (b.gf - b.gc) - (a.gf - a.gc)
  })
})

// Inicializar resultados vacíos
const inicializarResultados = () => {
  programacionCompleta.forEach(bloque => {
    if (!bloque.esDescanso) {
      resultados.value.set(`${bloque.id}-cancha1`, {
        matchup: bloque.cancha1,
        golesLocal: 0,
        golesVisita: 0,
        finalizado: false
      })
      resultados.value.set(`${bloque.id}-cancha2`, {
        matchup: bloque.cancha2,
        golesLocal: 0,
        golesVisita: 0,
        finalizado: false
      })
    }
  })
}

// Inicializar al cargar
inicializarResultados()

// Cargar datos de Firestore al montar
onMounted(async () => {
  try {
    const datos = await cargarCampeonatoFirestore()
    if (datos.resultados.size > 0) {
      resultados.value = datos.resultados
      console.log('✅ Datos cargados de Firestore')
    }
    if (datos.goleadoras.length > 0) {
      goleadoras.value = datos.goleadoras
      console.log('✅ Goleadoras cargadas de Firestore')
    }
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
})

// Watch para guardar automáticamente cada 5 segundos
let tiempoGuardadoAnterior = Date.now()
watch(
  [resultados, goleadoras],
  async () => {
    const ahora = Date.now()
    if (ahora - tiempoGuardadoAnterior >= 5000) {
      try {
        await guardarCampeonatoFirestore(resultados.value, goleadoras.value)
        tiempoGuardadoAnterior = ahora
        console.log('✅ Auto-guardado en Firestore')
      } catch (error) {
        console.error('Error guardando:', error)
      }
    }
  },
  { deep: true }
)

// Funciones de control
const guardarManualmente = async () => {
  try {
    await guardarCampeonatoFirestore(resultados.value, goleadoras.value)
    alert('✅ Campeonato guardado exitosamente')
  } catch (error) {
    alert('❌ Error al guardar: ' + error.message)
  }
}

const reiniciar = async () => {
  if (confirm('¿Estás seguro de que quieres reiniciar? Los datos locales se borrarán pero los guardados en Firestore se mantendrán.')) {
    resultados.value = new Map()
    goleadoras.value = []
    inicializarResultados()
    alert('✅ Campeonato reiniciado localmente')
  }
}

const confirmarEliminarCampeonato = async () => {
  if (confirm('⚠️ ¿Estás SEGURO de que quieres eliminar TODO el campeonato?\nEsto eliminará todos los resultados y goleadoras de Firestore.\nEsta acción NO se puede deshacer.')) {
    if (confirm('⚠️ ÚLTIMA CONFIRMACIÓN: ¿Eliminar TODO?')) {
      try {
        await limpiarCampeonatoFirestore()
        resultados.value = new Map()
        goleadoras.value = []
        inicializarResultados()
        alert('✅ Campeonato completamente eliminado')
      } catch (error) {
        alert('❌ Error al eliminar: ' + error.message)
      }
    }
  }
}
</script>

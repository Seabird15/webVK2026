// Script para inicializar los partidos del campeonato interno en Firebase
// Ejecutar una sola vez: node src/scripts/inicializarPartidos.js

import { inicializarPartidos, calcularTabla } from '../firebase/campeonatoInterno.js';

async function inicializar() {
  try {
    console.log('Inicializando partidos del campeonato interno...');
    await inicializarPartidos();
    console.log('✓ Partidos inicializados correctamente');
    
    console.log('Calculando tabla de posiciones...');
    await calcularTabla();
    console.log('✓ Tabla de posiciones calculada y guardada');
    
    console.log('\n¡Inicialización completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    process.exit(1);
  }
}

inicializar();

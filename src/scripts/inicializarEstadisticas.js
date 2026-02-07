/**
 * Script para inicializar estadísticas de goleadoras y asistidoras en Firebase
 * Ejecutar desde la consola del navegador en la página de admin
 */

import { getDocs, collection, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

const estadisticasIniciales = {
  ascenso: {
    goleadoras: [
      { nombre: 'Paula Santibañez', goles: 3, asistencias: 1 },
      { nombre: 'Gabriela Cordero', goles: 3, asistencias: 1 },
      { nombre: 'Tiare Bernal', goles: 1, asistencias: 3 },
      { nombre: 'Natalia Gajardo', goles: 1, asistencias: 0 },
      { nombre: 'Juliana Gundim', goles: 2, asistencias: 0 },
      { nombre: 'Eli Ormeño', goles: 2, asistencias: 1 },
      { nombre: 'Genesis Rodriguez', goles: 0, asistencias: 1 }
    ]
  }
};

export async function inicializarEstadisticasAscenso() {
  // // console.log('🔄 Iniciando actualización de estadísticas...');
  
  try {
    // Obtener todas las jugadoras de ascenso
    const q = query(
      collection(db, 'jugadoraRegistro'),
      where('equipo', 'in', ['ascenso', 'ambos'])
    );
    
    const snapshot = await getDocs(q);
    const jugadoras = snapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      apellido: doc.data().apellido,
      nombreCompleto: `${doc.data().nombre} ${doc.data().apellido}`.toLowerCase()
    }));

    // // console.log(`📋 Encontradas ${jugadoras.length} jugadoras en ascenso`);

    let actualizadas = 0;
    let noEncontradas = [];

    // Actualizar estadísticas
    for (const estadistica of estadisticasIniciales.ascenso.goleadoras) {
      const nombreBusqueda = estadistica.nombre.toLowerCase();
      
      // Buscar coincidencia parcial (por si el apellido está diferente)
      const jugadora = jugadoras.find(j => 
        j.nombreCompleto.includes(nombreBusqueda.split(' ')[0].toLowerCase())
      );

      if (jugadora) {
        const docRef = doc(db, 'jugadoraRegistro', jugadora.id);
        await updateDoc(docRef, {
          goles: estadistica.goles,
          asistencias: estadistica.asistencias,
          updatedAt: new Date()
        });
        
        // // console.log(`✅ Actualizada: ${jugadora.nombre} ${jugadora.apellido} - ${estadistica.goles} goles, ${estadistica.asistencias} asistencias`);
        actualizadas++;
      } else {
        noEncontradas.push(estadistica.nombre);
        // // console.warn(`⚠️  No encontrada: ${estadistica.nombre}`);
      }
    }

    // // console.log(`\n🎉 Proceso completado:`);
    // // console.log(`   ✅ ${actualizadas} jugadoras actualizadas`);
    if (noEncontradas.length > 0) {
      // // console.log(`   ⚠️  ${noEncontradas.length} no encontradas: ${noEncontradas.join(', ')}`);
    }

    return { actualizadas, noEncontradas };
  } catch (error) {
    // // console.error('❌ Error:', error);
    throw error;
  }
}

// Para ejecutar desde consola:
// import { inicializarEstadisticasAscenso } from './scripts/inicializarEstadisticas.js'
// inicializarEstadisticasAscenso()

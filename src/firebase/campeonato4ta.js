import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './config'
import { ref } from 'vue'

// Referencia a la colección
const CAMPEONATO_4TA_DOC = 'campeonato_vikingas_4ta'
const CAMPEONATO_4TA_COLLECTION = 'campeonatos'

/**
 * Convierte Map de resultados a objeto serializable
 */
const resultadosMapToObject = (resultadosMap) => {
  const obj = {}
  for (const [key, value] of resultadosMap.entries()) {
    obj[key] = {
      matchup: value.matchup,
      golesLocal: value.golesLocal,
      golesVisita: value.golesVisita,
      finalizado: value.finalizado
    }
  }
  return obj
}

/**
 * Convierte objeto serializado a Map de resultados
 */
const objectToResultadosMap = (obj) => {
  const map = new Map()
  if (obj) {
    for (const [key, value] of Object.entries(obj)) {
      map.set(key, {
        matchup: value.matchup,
        golesLocal: value.golesLocal,
        golesVisita: value.golesVisita,
        finalizado: value.finalizado
      })
    }
  }
  return map
}

/**
 * Guarda los datos del campeonato en Firestore
 */
export const guardarCampeonatoFirestore = async (resultados, goleadoras) => {
  try {
    const resultadosObj = resultadosMapToObject(resultados)
    const docRef = doc(db, CAMPEONATO_4TA_COLLECTION, CAMPEONATO_4TA_DOC)
    
    await setDoc(
      docRef,
      {
        resultados: resultadosObj,
        goleadoras: goleadoras,
        fechaActualizacion: new Date().toISOString()
      },
      { merge: true }
    )
    
    console.log('✅ Campeonato guardado en Firestore')
    return true
  } catch (error) {
    console.error('❌ Error guardando campeonato:', error)
    throw error
  }
}

/**
 * Carga los datos del campeonato desde Firestore
 */
export const cargarCampeonatoFirestore = async () => {
  try {
    const docRef = doc(db, CAMPEONATO_4TA_COLLECTION, CAMPEONATO_4TA_DOC)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      console.log('✅ Campeonato cargado de Firestore')
      return {
        resultados: objectToResultadosMap(data.resultados || {}),
        goleadoras: data.goleadoras || []
      }
    } else {
      console.log('📝 No existe campeonato guardado, usando valores vacíos')
      return {
        resultados: new Map(),
        goleadoras: []
      }
    }
  } catch (error) {
    console.error('❌ Error cargando campeonato:', error)
    throw error
  }
}

/**
 * Elimina todo el campeonato de Firestore
 */
export const limpiarCampeonatoFirestore = async () => {
  try {
    const docRef = doc(db, CAMPEONATO_4TA_COLLECTION, CAMPEONATO_4TA_DOC)
    await deleteDoc(docRef)
    console.log('✅ Campeonato eliminado de Firestore')
    return true
  } catch (error) {
    console.error('❌ Error eliminando campeonato:', error)
    throw error
  }
}

/**
 * Observable en tiempo real del campeonato
 */
export const observarCampeonatoFirestore = (callback) => {
  try {
    const docRef = doc(db, CAMPEONATO_4TA_COLLECTION, CAMPEONATO_4TA_DOC)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        callback({
          resultados: objectToResultadosMap(data.resultados || {}),
          goleadoras: data.goleadoras || []
        })
      } else {
        callback({
          resultados: new Map(),
          goleadoras: []
        })
      }
    })
    
    return unsubscribe
  } catch (error) {
    console.error('❌ Error observando campeonato:', error)
    throw error
  }
}

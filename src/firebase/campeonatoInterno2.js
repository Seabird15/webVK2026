import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './config';

const COLECCION = 'campeonatoInterno2';

export const EQUIPOS_CAMPEONATO = [
  { id: 'tinky', nombre: 'Las Tinky Winky', nombreCorto: 'Tinky Winky', color: '#a855f7' },
  { id: 'legion', nombre: 'Legión Roja', nombreCorto: 'Legión Roja', color: '#ef4444' },
  { id: 'valkirias', nombre: 'Valkirias', nombreCorto: 'Valkirias', color: '#d6d3d1' }
];

export const FIXTURE_INICIAL = [
  {
    id: 'f1-p1', fecha: 1, fechaLabel: 'Sábado 17 de octubre', hora: '19:05',
    local: 'tinky', visita: 'valkirias', golesLocal: null, golesVisita: null, estado: 'programado'
  },
  {
    id: 'f1-p2', fecha: 1, fechaLabel: 'Sábado 17 de octubre', hora: '20:05',
    local: 'tinky', visita: 'legion', golesLocal: null, golesVisita: null, estado: 'programado'
  },
  {
    id: 'f2-p1', fecha: 2, fechaLabel: 'Sábado 24 de octubre', hora: '19:05',
    local: 'legion', visita: 'valkirias', golesLocal: null, golesVisita: null, estado: 'programado'
  },
  {
    id: 'f2-p2', fecha: 2, fechaLabel: 'Sábado 24 de octubre', hora: '20:05',
    local: 'legion', visita: 'tinky', golesLocal: null, golesVisita: null, estado: 'programado'
  },
  {
    id: 'f3-p1', fecha: 3, fechaLabel: 'Sábado 31 de octubre', hora: '19:05',
    local: 'valkirias', visita: 'tinky', golesLocal: null, golesVisita: null, estado: 'programado'
  },
  {
    id: 'f3-p2', fecha: 3, fechaLabel: 'Sábado 31 de octubre', hora: '20:05',
    local: 'valkirias', visita: 'legion', golesLocal: null, golesVisita: null, estado: 'programado'
  },
  {
    id: 'final', fecha: 4, fechaLabel: 'Sábado 7 de noviembre', hora: 'Gran final',
    local: 'primero', visita: 'segundo', golesLocal: null, golesVisita: null, estado: 'programado', esFinal: true
  }
];

export const ESTADOS_PARTIDO = [
  { value: 'programado', label: 'Programado' },
  { value: 'en_juego', label: 'En juego' },
  { value: 'finalizado', label: 'Finalizado' }
];

export const NOMINAS_INICIALES = {
  tinky: ['Tiare Bernal (C)', 'Gricel', 'Tania', 'Nico', 'Yas', 'Bele', 'Daisy', 'Jessi Paz', 'Fer Orfanoz', 'Valeria', 'Jose', 'Ge', 'Natiluminati'],
  legion: ['Mi Beaudout (C)', 'Jane', 'Roxi', 'Majo', 'Eve Torres', 'Motta', 'Carlita', 'Liss', 'Dani Farias', 'Ju', 'Kari', 'Barby', 'Cami Rago'],
  valkirias: ['Jesi Chirito (C)', 'Lulu', 'Chama', 'Eli Ormeño', 'Danae', 'Mila', 'Carito', 'Chica Nati', 'Eli Orfanoz', 'Eve Quiroga', 'Kathy Arce', 'Eli López', 'Pao Varas']
};

export const inicializarNominasCampeonato = async () => {
  const snapshot = await getDocs(collection(db, COLECCION));
  const existentes = new Set(snapshot.docs.map((documento) => documento.id));

  await Promise.all(
    EQUIPOS_CAMPEONATO
      .filter((equipo) => !existentes.has(`nomina_${equipo.id}`))
      .map((equipo) => setDoc(doc(db, COLECCION, `nomina_${equipo.id}`), {
        tipo: 'nomina',
        equipoId: equipo.id,
        jugadoras: NOMINAS_INICIALES[equipo.id] || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }))
  );
};

export const guardarNominaCampeonato = async (equipoId, jugadoras) => {
  if (!equipoId) throw new Error('Falta el equipo.');
  const limpias = (Array.isArray(jugadoras) ? jugadoras : [])
    .map((nombre) => (nombre || '').toString().trim())
    .filter(Boolean)
    .slice(0, 40);
  if (!limpias.length) throw new Error('La nómina no puede quedar vacía.');

  await setDoc(doc(db, COLECCION, `nomina_${equipoId}`), {
    tipo: 'nomina',
    equipoId,
    jugadoras: limpias,
    updatedAt: serverTimestamp()
  }, { merge: true });
  return limpias;
};

export const inicializarPartidosCampeonato = async () => {
  const snapshot = await getDocs(collection(db, COLECCION));
  const existentes = new Set(snapshot.docs.map((documento) => documento.id));

  await Promise.all(
    FIXTURE_INICIAL
      .filter((partido) => !existentes.has(partido.id))
      .map((partido) => setDoc(doc(db, COLECCION, partido.id), {
        ...partido,
        tipo: 'partido',
        goleadoras: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }))
  );
};

export const escucharCampeonatoCompleto = (callback, onError) => {
  return onSnapshot(
    collection(db, COLECCION),
    (snapshot) => {
      const partidos = [];
      const nominas = {};
      snapshot.docs.forEach((documento) => {
        const data = { id: documento.id, ...documento.data() };
        if (data.tipo === 'nomina') {
          nominas[data.equipoId] = Array.isArray(data.jugadoras) ? data.jugadoras : [];
        } else {
          partidos.push(data);
        }
      });
      const orden = new Map(FIXTURE_INICIAL.map((partido, index) => [partido.id, index]));
      partidos.sort((a, b) => (orden.get(a.id) ?? 99) - (orden.get(b.id) ?? 99));
      EQUIPOS_CAMPEONATO.forEach((equipo) => {
        if (!nominas[equipo.id]) nominas[equipo.id] = NOMINAS_INICIALES[equipo.id] || [];
      });
      callback({ partidos, nominas });
    },
    onError
  );
};

export const escucharPartidosCampeonato = (callback, onError) => {
  return onSnapshot(
    collection(db, COLECCION),
    (snapshot) => {
      const partidos = snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
      const orden = new Map(FIXTURE_INICIAL.map((partido, index) => [partido.id, index]));
      partidos.sort((a, b) => (orden.get(a.id) ?? 99) - (orden.get(b.id) ?? 99));
      callback(partidos);
    },
    onError
  );
};

const normalizarGoles = (valor) => {
  if (valor === null || valor === undefined || valor === '') return null;
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return null;
  return Math.max(0, Math.min(99, Math.round(numero)));
};

export const actualizarPartidoCampeonato = async (id, { golesLocal, golesVisita, estado, goleadoras }) => {
  if (!id) throw new Error('Falta el partido.');
  const gl = normalizarGoles(golesLocal);
  const gv = normalizarGoles(golesVisita);

  const goleadorasLimpias = Array.isArray(goleadoras)
    ? goleadoras
      .filter((gol) => gol?.nombre && gol?.equipoId)
      .map((gol) => ({
        nombre: gol.nombre.toString().trim(),
        equipoId: gol.equipoId.toString()
      }))
      .filter((gol) => gol.nombre)
    : [];

  await updateDoc(doc(db, COLECCION, id), {
    golesLocal: gl,
    golesVisita: gv,
    estado: ESTADOS_PARTIDO.some((item) => item.value === estado) ? estado : 'programado',
    goleadoras: goleadorasLimpias,
    updatedAt: serverTimestamp()
  });
};

export const calcularGoleadoras = (partidos) => {
  const conteo = new Map();

  partidos
    .filter((partido) => partido.estado === 'en_juego' || partido.estado === 'finalizado')
    .forEach((partido) => {
      (Array.isArray(partido.goleadoras) ? partido.goleadoras : []).forEach((gol) => {
        if (!gol?.nombre) return;
        const clave = `${gol.nombre}|${gol.equipoId}`;
        const actual = conteo.get(clave) || { nombre: gol.nombre, equipoId: gol.equipoId, goles: 0 };
        actual.goles += 1;
        conteo.set(clave, actual);
      });
    });

  return [...conteo.values()].sort((a, b) => b.goles - a.goles);
};

export const calcularTabla = (partidos) => {
  const tabla = new Map(
    EQUIPOS_CAMPEONATO.map((equipo) => [equipo.id, {
      ...equipo, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0
    }])
  );

  partidos
    .filter((partido) => !partido.esFinal && (partido.estado === 'en_juego' || partido.estado === 'finalizado'))
    .forEach((partido) => {
      const gl = Number(partido.golesLocal);
      const gv = Number(partido.golesVisita);
      if (!Number.isFinite(gl) || !Number.isFinite(gv)) return;

      const local = tabla.get(partido.local);
      const visita = tabla.get(partido.visita);
      if (!local || !visita) return;

      local.pj += 1; visita.pj += 1;
      local.gf += gl; local.gc += gv;
      visita.gf += gv; visita.gc += gl;

      if (gl > gv) { local.pg += 1; local.pts += 3; visita.pp += 1; }
      else if (gl < gv) { visita.pg += 1; visita.pts += 3; local.pp += 1; }
      else { local.pe += 1; visita.pe += 1; local.pts += 1; visita.pts += 1; }
    });

  return [...tabla.values()]
    .map((equipo) => ({ ...equipo, dg: equipo.gf - equipo.gc }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
};

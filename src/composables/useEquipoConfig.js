/**
 * Composable para gestionar la configuración de equipos del campeonato
 */
export const useEquipoConfig = () => {
  const equiposConfig = {
    verserkers: {
      key: 'verserkers',
      nombre: 'LAS VERSERKERS',
      nombreCorto: 'Las Verserkers',
      logo: 'versekersLogo.jpeg',
      color: 'cyan',
      capitana: 'Barby'
    },
    internadas: {
      key: 'internadas',
      nombre: 'INTER NADAS',
      nombreCorto: 'Inter Nadas',
      logo: 'internadasLogo.jpeg',
      color: 'gray',
      capitana: 'Pau Motta'
    },
    siemprealpalo: {
      key: 'siemprealpalo',
      nombre: 'SIEMPRE AL PALO FC',
      nombreCorto: 'Siempre al Palo FC',
      logo: 'siemprealpaloLogo.jpeg',
      color: 'red',
      capitana: 'Dany Farias'
    }
  };

  const getEquipoData = (equipoKey) => {
    return equiposConfig[equipoKey] || null;
  };

  const getEquiposList = () => {
    return Object.values(equiposConfig);
  };

  const getEquipoLogo = (equipoKey) => {
    return `/src/assets/${equiposConfig[equipoKey]?.logo || ''}`;
  };

  const getEquipoColor = (equipoKey) => {
    return equiposConfig[equipoKey]?.color || 'primary';
  };

  const getEquipoNombre = (equipoKey) => {
    return equiposConfig[equipoKey]?.nombreCorto || '';
  };

  return {
    equiposConfig,
    getEquipoData,
    getEquiposList,
    getEquipoLogo,
    getEquipoColor,
    getEquipoNombre
  };
};

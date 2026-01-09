import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const url = 'https://trotamundos.cl/index.php/ligadobleve-summer-cup/';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const tabla = [];

    // Buscar todas las filas de la tabla
    const rows = $('table tbody tr');

    rows.each((index, element) => {
      const cells = $(element).find('td');
      
      if (cells.length >= 11) {
        const teamName = $(cells[1]).text().trim();
        
        // Solo procesar filas que tengan nombre de equipo válido
        if (teamName && teamName.length > 0) {
          tabla.push({
            posicion: index + 1,
            equipo: teamName,
            pj: $(cells[2]).text().trim(),
            pg: $(cells[3]).text().trim(),
            pe: $(cells[4]).text().trim(),
            pp: $(cells[5]).text().trim(),
            dg: $(cells[6]).text().trim(),
            gf: $(cells[7]).text().trim(),
            gc: $(cells[8]).text().trim(),
            ptos: $(cells[9]).text().trim(),
            ultimos: $(cells[10]).text().trim()
          });
        }
      }
    });

    if (tabla.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No se pudo procesar la tabla. Por favor intenta más tarde.'
      });
    }

    res.status(200).json({
      success: true,
      data: tabla,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en scraping:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los datos',
      error: error.message
    });
  }
}

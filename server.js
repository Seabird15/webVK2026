import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3001;

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Endpoint para obtener la tabla de posiciones de Serie AB
app.get('/api/competencias/tabla-ab', async (req, res) => {
  try {
    const url = 'https://trotamundos.cl/index.php/ligadobleve-summer-cup/';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const tabla = [];

    // Buscar la tabla de Serie AB+
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

    // Si no encontramos datos en la tabla principal, devolvemos una respuesta alternativa
    if (tabla.length === 0) {
      return res.json({
        success: false,
        message: 'No se pudo procesar la tabla. Por favor intenta más tarde.'
      });
    }

    res.json({
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
});

// Endpoint de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoint tabla AB: http://localhost:${PORT}/api/competencias/tabla-ab`);
});

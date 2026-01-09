export default async function handler(req, res) {
  // Permitir CORS desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = 'https://trotamundos.cl/index.php/ligadobleve-summer-cup/';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    
    // Simple parsing sin dependencias externas
    // Buscamos la tabla y extraemos datos
    const tabla = parseTabla(html);
    
    console.log('Tabla parseada:', tabla.length, 'filas');

    if (tabla.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No se pudo procesar la tabla. Por favor intenta más tarde.',
        debug: 'No rows found in HTML'
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

// Parser simple sin dependencias
function parseTabla(html) {
  const tabla = [];
  
  try {
    // Buscar todas las tablas
    const tablesRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let tableMatch;
    
    while ((tableMatch = tablesRegex.exec(html)) !== null) {
      const tableHtml = tableMatch[1];
      
      // Buscar filas (tr) en esta tabla
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let rowMatch;
      let rowIndex = 0;
      
      while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
        const rowHtml = rowMatch[1];
        
        // Buscar celdas (td) en esta fila
        const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        const cells = [];
        let cellMatch;
        
        while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
          cells.push(cellMatch[1]);
        }
        
        // Validar que tenga suficientes columnas
        if (cells.length >= 10) {
          const teamName = cleanHtml(cells[1]).trim();
          
          // Validar que sea un nombre de equipo válido
          if (teamName && teamName.length > 2) {
            tabla.push({
              posicion: tabla.length + 1,
              equipo: teamName,
              pj: cleanHtml(cells[2]).trim(),
              pg: cleanHtml(cells[3]).trim(),
              pe: cleanHtml(cells[4]).trim(),
              pp: cleanHtml(cells[5]).trim(),
              dg: cleanHtml(cells[6]).trim(),
              gf: cleanHtml(cells[7]).trim(),
              gc: cleanHtml(cells[8]).trim(),
              ptos: cleanHtml(cells[9]).trim(),
              ultimos: cells.length > 10 ? cleanHtml(cells[10]).trim() : ''
            });
          }
        }
        
        rowIndex++;
      }
      
      // Si encontramos datos, salir del loop de tablas
      if (tabla.length > 0) break;
    }
  } catch (err) {
    console.error('Error parsing tabla:', err);
  }
  
  return tabla;
}

// Limpiar HTML
function cleanHtml(html) {
  return html
    .replace(/<[^>]*>/g, '') // Remover tags HTML
    .replace(/&nbsp;/g, ' ')  // Remover &nbsp;
    .replace(/&amp;/g, '&')   // Remover &amp;
    .replace(/&lt;/g, '<')    // Remover &lt;
    .replace(/&gt;/g, '>')    // Remover &gt;
    .replace(/&quot;/g, '"')  // Remover &quot;
    .replace(/&#039;/g, "'")  // Remover &#039;
    .replace(/\s+/g, ' ')     // Normalizar espacios
    .trim();
}

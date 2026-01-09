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

// Parser simple sin dependencias
function parseTabla(html) {
  const tabla = [];
  
  // Buscar la tabla usando regex
  const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/);
  if (!tableMatch) return tabla;
  
  const tableHtml = tableMatch[0];
  
  // Buscar filas
  const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/g;
  const rows = tableHtml.match(rowRegex) || [];
  
  rows.forEach((row, index) => {
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
    const cells = [];
    let match;
    
    while ((match = cellRegex.exec(row)) !== null) {
      cells.push(match[1]);
    }
    
    if (cells.length >= 11) {
      // Limpieza de HTML
      const teamName = cleanHtml(cells[1]).trim();
      
      if (teamName && teamName.length > 0) {
        tabla.push({
          posicion: index + 1,
          equipo: teamName,
          pj: cleanHtml(cells[2]).trim(),
          pg: cleanHtml(cells[3]).trim(),
          pe: cleanHtml(cells[4]).trim(),
          pp: cleanHtml(cells[5]).trim(),
          dg: cleanHtml(cells[6]).trim(),
          gf: cleanHtml(cells[7]).trim(),
          gc: cleanHtml(cells[8]).trim(),
          ptos: cleanHtml(cells[9]).trim(),
          ultimos: cleanHtml(cells[10]).trim()
        });
      }
    }
  });
  
  return tabla;
}

// Limpiar HTML
function cleanHtml(html) {
  return html
    .replace(/<[^>]*>/g, '') // Remover tags
    .replace(/&nbsp;/g, ' ')  // Remover &nbsp;
    .replace(/&amp;/g, '&')   // Remover &amp;
    .replace(/\s+/g, ' ')     // Normalizar espacios
    .trim();
}

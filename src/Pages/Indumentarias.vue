<template>
  <section class="relative w-full bg-linear-to-b from-black via-gray-950 to-black py-12 px-4 overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 adorno-pattern adorno-pattern-a" :style="fondoAdornosStyleA"></div>
      <div class="absolute inset-0 adorno-pattern adorno-pattern-b" :style="fondoAdornosStyleB"></div>
      <div class="absolute inset-0 bg-black/35"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(250,204,21,0.10),transparent_40%)]"></div>
    </div>

    <div class="max-w-6xl mx-auto space-y-8 relative z-10">
      <header class="bg-linear-to-r from-primary-dark via-black to-black rounded-3xl p-6 md:p-10 text-white overflow-hidden relative border border-primary/30 shadow-2xl">
        <div class="absolute -right-14 -top-10 w-52 h-52 rounded-full bg-primary/20"></div>
        <div class="absolute -left-10 -bottom-16 w-44 h-44 rounded-full bg-primary/10"></div>
        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#facc15,transparent_45%)]"></div>

        <div class="relative z-10 max-w-2xl">
          <p class="text-primary font-black tracking-[0.2em] text-xs uppercase mb-2">Tienda Oficial</p>
          <h1 class="text-4xl md:text-5xl font-black uppercase tracking-wide leading-tight">Indumentarias Vikingas</h1>
          <p class="text-white/85 mt-3 text-sm md:text-base font-semibold">
            Nueva colección de camisetas, cortavientos, polerones y accesorios para jugadoras e hinchas.
          </p>

          <div class="flex flex-wrap items-center gap-2 mt-5">
            <span class="px-3 py-1 rounded-full bg-primary text-black text-xs font-black uppercase">Catálogo 2026</span>
            <span class="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-black uppercase">Stock sujeto a disponibilidad</span>
          </div>
        </div>
      </header>

      <div v-if="productos.length === 0" class="text-center py-16 bg-white rounded-2xl border-2 border-gray-200">
        <p class="text-gray-500 font-semibold">No hay productos cargados por ahora.</p>
      </div>

      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
        <article
          v-for="producto in productos"
          :key="producto.src"
          class="tienda-card mb-6 break-inside-avoid group bg-linear-to-b from-white to-gray-100 border border-white/20 rounded-2xl overflow-hidden hover:shadow-[0_0_0_1px_rgba(250,204,21,0.3),0_20px_40px_rgba(0,0,0,0.45)] transition-all duration-300"
        >
          <div class="relative overflow-hidden bg-linear-to-b from-gray-900 via-black to-gray-800 p-3">
            <img
              :src="producto.src"
              :alt="producto.nombre"
              class="w-full h-auto max-h-140 object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
            />

            <div class="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/70 to-transparent pointer-events-none"></div>

            <div class="absolute top-3 left-3 flex flex-wrap gap-2">
              <span class="px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-black uppercase tracking-wide">
                {{ producto.categoria }}
              </span>
              <span v-if="producto.destacado" class="px-2.5 py-1 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-wide">
                Destacado
              </span>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <div>
              <h2 class="text-sm md:text-base font-black text-gray-900 uppercase tracking-wide leading-tight">
                {{ producto.nombre }}
              </h2>
              <p class="text-xs text-gray-500 font-semibold mt-1">Modelo: {{ producto.referencia }}</p>
            </div>

            <p class="text-[11px] text-gray-500 font-bold uppercase">{{ producto.tallas }}</p>

            <a
              :href="instagramLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-black text-primary font-black text-sm uppercase tracking-wide hover:bg-gray-900 transition-colors"
            >
              Consultar esta prenda
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const imagenesIndumentaria = import.meta.glob('../assets/Indumentaria/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default'
});

const limpiarNombreArchivo = (ruta) => {
  const archivo = ruta.split('/').pop() || '';
  return archivo.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
};

const esAdornoArchivo = (texto) => {
  return (texto || '').toLowerCase().includes('adorno3');
};

const obtenerCategoria = (texto) => {
  const t = (texto || '').toLowerCase();
  if (t.includes('camiseta')) return 'Camiseta';
  if (t.includes('cortavientos')) return 'Cortavientos';
  if (t.includes('poleron')) return 'Polerón';
  if (t.includes('adorno')) return 'Decoración';
  return 'Indumentaria';
};

const obtenerTallas = (categoria) => {
  if (categoria === 'Accesorio') return 'Único';
  return 'XS a XL';
};

const esColeccion2026 = (texto) => {
  return /2026/.test((texto || '').toString());
};

const nombreComercial = (base) => {
  const valor = (base || '').toLowerCase();

  if (valor.includes('arquera')) return 'Camiseta Arquera Elite';
  if (valor.includes('turquesa')) return 'Camiseta Turquesa Match';
  if (valor.includes('clara') && valor.includes('frente')) return 'Camiseta Clara Home (Frente)';
  if (valor.includes('clara') && valor.includes('espalda')) return 'Camiseta Clara Home (Espalda)';
  if (valor.includes('cortavientos')) return 'Cortavientos Oficial Club';
  if (valor.includes('poleron')) return 'Polerón Canguro Vikingas';
  if (valor.includes('camiseta')) return 'Camiseta Oficial Vikingas';
  if (valor.includes('adorno')) return 'Accesorio Fan Vikingas';

  return base;
};

const instagramLink = 'https://instagram.com/cdvikingas';

const productos = Object.entries(imagenesIndumentaria)
  .map(([ruta, src]) => {
    const referencia = limpiarNombreArchivo(ruta);
    const nombre = nombreComercial(referencia);
    const categoria = obtenerCategoria(referencia);
    const esAdorno = esAdornoArchivo(referencia);
    const coleccion2026 = esColeccion2026(referencia);

    return {
      src,
      nombre,
      referencia,
      categoria,
      esAdorno,
      coleccion2026,
      tallas: obtenerTallas(categoria),
      destacado: coleccion2026
    };
  })
  .filter((item) => !item.esAdorno)
  .sort((a, b) => {
    if (a.coleccion2026 !== b.coleccion2026) {
      return a.coleccion2026 ? -1 : 1;
    }
    return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
  });

const adornosDecorativos = Object.entries(imagenesIndumentaria)
  .map(([ruta, src]) => {
    const referencia = limpiarNombreArchivo(ruta);
    return {
      src,
      nombre: referencia,
      esAdorno: esAdornoArchivo(referencia)
    };
  })
  .filter((item) => item.esAdorno);

const urlsAdornos = adornosDecorativos.map((item) => `url('${item.src}')`);

const crearPatternStyle = (sizeA, sizeB, posA, posB, opacidad) => ({
  backgroundImage: urlsAdornos.join(', '),
  backgroundRepeat: urlsAdornos.map(() => 'repeat').join(', '),
  backgroundSize: urlsAdornos.map((_, index) => (index % 2 === 0 ? sizeA : sizeB)).join(', '),
  backgroundPosition: urlsAdornos.map((_, index) => (index % 2 === 0 ? posA : posB)).join(', '),
  opacity: opacidad,
  filter: 'grayscale(100%) brightness(1.2) contrast(1.2) saturate(0.4)'
});

const fondoAdornosStyleA = crearPatternStyle('260px 260px', '340px 340px', '0 0', '160px 120px', '0.34');
const fondoAdornosStyleB = crearPatternStyle('300px 300px', '380px 380px', '120px 80px', '40px 200px', '0.18');
</script>

<style scoped>
.tienda-card {
  backdrop-filter: blur(2px);
}

.adorno-pattern {
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.9) 12%, rgba(0, 0, 0, 0.9) 88%, transparent 100%);
}

.adorno-pattern-a {
  animation: moverPatronA 38s linear infinite;
}

.adorno-pattern-b {
  mix-blend-mode: screen;
  transform: rotate(-2deg) scale(1.06);
  animation: moverPatronB 55s linear infinite reverse;
}

@keyframes moverPatronA {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 320px 280px;
  }
}

@keyframes moverPatronB {
  from {
    background-position: 120px 80px;
  }
  to {
    background-position: -260px 220px;
  }
}
</style>

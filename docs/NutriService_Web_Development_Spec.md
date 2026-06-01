# NutriService.cl — Especificación de Desarrollo Web (v2)

## Objetivo General
Actualizar la experiencia del sitio para mejorar navegación, claridad comercial, arquitectura de información, visibilidad de soluciones nutricionales y presentación de productos por industria.

---

## Estado de implementación (auditoría vs codebase `v0.4`)

**Leyenda:** `[x]` listo · `[~]` parcial · `[ ]` pendiente

| Área | Estado |
|------|--------|
| Navegación global | Parcial |
| Hero / portada | Parcial |
| Indicadores destacados | Parcial |
| Verticales industria | Parcial |
| Bloque institucional | Pendiente |
| Página Nosotros | Parcial |
| Página Maquila (ruta) | Pendiente |
| Página Soluciones | Parcial |
| Página Contacto | Parcial |
| Catálogo productos | Parcial |
| SEO / legal | Parcial |

**Rutas en producción:** `/`, `/nosotros`, `/impacto`, `/soluciones` (+ 4 subpasos), `/industrias` (+ 4 slugs), `/productos` (+ 29 fichas), `/contacto`, `/legal/*` · **Sin ruta:** `/maquila`

---

# TODO MASTER

## 1. Navegación Global

### Prioridad: Alta

- [x] Eliminar menú lateral izquierdo actual. *(Scroll legend removido de `app/page.tsx`)*
- [x] Implementar navegación superior fija (sticky). *(`components/nav.tsx`)*
- [x] Agregar sección "Nosotros". *(`/nosotros`, link en nav y footer)*
- [ ] Reemplazar "I+D" por "Maquila". *(I+D eliminado; falta link Maquila en nav — hoy: Soluciones · Nosotros · Impacto)*
- [ ] Crear menú desplegable "Soluciones".

### Estructura propuesta

```txt
Inicio
Nosotros
Soluciones
 ├─ Acuícola
 ├─ Cerdos
 ├─ Aves
 ├─ Mascotas
 └─ Maquila
Contacto
```

- [x] Agregar navegación rápida para volver al inicio. *(`PageBackHeader` — ← Volver en contacto, soluciones, impacto, industrias, nosotros)*
- [~] Mejorar accesibilidad móvil. *(Menú móvil + toggles de audio en nav mobile)*
- [~] Revisar estados hover y active. *(Implementados en nav; no alineados 100% con spec IA)*

**Notas:** Nav incluye **Impacto** (no está en la IA del spec). `/tecnologia` redirige a `/nosotros`.

---

# 2. Hero / Portada

## Contenido

### Reemplazar texto

Antes:
> Excelencia industrial desde 1993

Nuevo:
> Más de 30 años al servicio de la nutrición funcional animal en Chile.

- [ ] Eyebrow del hero actualizado al copy del spec. *(Sigue "Excelencia industrial desde 1993" en `Hero_SA.tsx`)*
- [x] Descripción del hero actualizada. *("Soluciones funcionales para una alimentación y producción responsables" — v0.4)*
- [x] CTA principal único (sin secundario). *(v0.4)*

### Video Hero

- [~] Agregar control visible de audio. *(Widget flotante `SoundWidget` + toggles en nav mobile; no control sobre el video del hero)*
- [~] Botón mute/unmute persistente. *(Música ambiental + FX; no mute del clip de video)*
- [ ] Estado visual claro en el hero para audio del video.

- [x] Secuencia de video hero (salmón → mascotas → aves). *(`lib/hero-video-sequence.ts`)*
- [x] Preloader + reveal. *(`components/site-experience.tsx`)*

---

# 3. Indicadores Destacados

Reemplazar bloque completo.

## Mantener

- [x] Más de 30 años de experiencia en la industria. *(`ProblemTrustStatsBar` en `components/problem-section.tsx`)*

## Agregar

- [~] Autonomía productiva.
  - Producción y almacenamiento con infraestructura propia.
  - *(Headline "Autonomía" + "productiva real" en UI; sin copy descriptivo del spec)*

- [~] Sustentabilidad.
  - Compromiso con la nutrición animal responsable.
  - *(Headline "Sustentabilidad" en UI; sin copy descriptivo del spec)*

- [ ] Maquila.
  - Control, trazabilidad y confidencialidad.
  - *(No aparece como indicador en la franja de stats)*

---

# 4. Verticales de Industria

## Actualización visual

- [~] Reemplazar imágenes genéricas. *(Assets organizados en `public/assets/`; calidad/fotos reales por validar con cliente)*
- [ ] Incorporar fotografías reales confirmadas por cliente.
- [~] Unificar estilo visual. *(Home carousel e `/industrias` comparten imágenes — v0.4)*
- [~] Consistencia con identidad NutriService.

### Verticales

- [x] Acuícola — página dedicada con video hero
- [x] Cerdos (Porcina) — slug `porcina`, template genérico
- [x] Aves (Avícola) — página dedicada con video hero
- [x] Mascotas — página dedicada con video hero
- [ ] Maquila — no existe como vertical ni en carousel

- [x] Páginas industria: sin cards placeholder del hero, sin stats en hero, ← Volver *(v0.4)*

---

# 5. Bloque Institucional

## Reemplazar texto

### Título

Nutrición inteligente para una producción más eficiente

### Descripción

Creemos en una nutrición inteligente y responsable, adaptada a las necesidades de cada especie y sistema productivo, promoviendo salud animal, eficiencia nutricional y productividad.

### CTA

Antes:
> Ver Fórmulas

Después:
> Ver Soluciones Nutricionales

- [ ] Bloque institucional con copy del spec. *(No implementado en homepage)*
- [ ] CTA "Ver Soluciones Nutricionales". *(Industrias usa "Ver fórmulas" / "Ver Protocolos" en otros puntos)*

---

# 6. Página Nosotros

## Nueva sección

### Mensaje principal

> Ciencia que alimenta confianza.
> Personas que impulsan soluciones.

### Contenido sugerido

- [~] Historia de la empresa. *(`ImpactoHistorySection` — botón "Ver nuestra historia" → "Coming soon")*
- [~] Más de 30 años de trayectoria. *(Párrafo intro en hero de `/nosotros`)*
- [ ] Infraestructura productiva.
- [ ] Certificaciones.
- [ ] Equipo técnico.
- [ ] Capacidad logística.
- [ ] Compromiso con la sustentabilidad.

- [x] Ruta `/nosotros` separada de `/impacto`. *(Redirect `/nosotros` → `/impacto` eliminado — v0.4)*
- [ ] Headline del spec ("Ciencia que alimenta confianza…").

---

# 7. Página Maquila

## Nueva sección principal

### Hero

Damos solución de producción a terceros en la elaboración de sus propios productos garantizando confidencialidad.

En NutriService entendemos que la maquila es una herramienta estratégica para impulsar la competitividad en la industria de nutrición animal.

Nuestra división está orientada a ofrecer un servicio integral de producción a terceros, garantizando calidad, seguridad y eficiencia en cada etapa del proceso.

---

## Beneficios

### Libre de antibióticos

Producción de premezclas, suplementos y soluciones nutricionales libres de antibióticos.

### Trazabilidad

Control total de materias primas, lotes y procesos.

### Calidad Certificada

Procesos auditados y certificados GMP y REP.

### Tecnología

Equipamiento moderno y formulación especializada.

- [x] Sección Maquila en homepage. *(`components/maquila-section.tsx`, copy confidencialidad v0.4)*
- [ ] Página dedicada `/maquila`.
- [ ] Hero y beneficios del spec (4 bloques).
- [ ] Link Maquila en nav / footer.

---

# 8. Página Soluciones

## Bloque CTA

### Título

Hable con nuestro equipo técnico-comercial

### Texto

Lo acompañamos en la búsqueda de soluciones nutricionales funcionales adaptadas a los desafíos de cada especie y sistema productivo.

### CTA

Agendar Reunión

- [x] Página `/soluciones` con hero, carrusel productos, sección impacto, CTA.
- [x] Subpáginas: diagnóstico, formulación, implementación, optimización.
- [x] ← Volver simple en hero *(v0.4)*.
- [ ] Copy CTA alineado al spec ("Hable con nuestro equipo…" / "Agendar Reunión").

---

# 9. Página Contacto

## Actualizar bajada

No es una llamada de ventas.

Es una conversación técnica para entender tus desafíos productivos y evaluar soluciones específicas.

### Formulario

Actualizar categorías:

- Acuícola
- Cerdos
- Aves
- Mascotas
- Maquila

- [x] Página contacto con layout glass + direcciones + horarios.
- [x] ← Volver al inicio sobre el card *(v0.4)*.
- [x] Margen superior para no quedar bajo navbar *(v0.4)*.
- [ ] Bajada del spec en hero. *(Removida en v0.4 — solo título "Hablemos de tu operación")*
- [~] Categorías formulario: Acuícola, Avícola, Porcina, Mascotas, Otro — **falta Maquila**; "Cerdos" = "Porcina".
- [ ] Integración backend / CRM del formulario. *(Mock → `/contacto/gracias`)*

---

# 10. Catálogo de Soluciones Nutricionales

## Objetivo

Crear fichas individuales de productos.

Cada ficha debe incluir:

- [x] Imagen producto
- [ ] Marca
- [ ] Fabricante
- [x] Función
- [x] Beneficios
- [x] Industria
- [x] CTA contacto

- [x] Catálogo `/productos` con filtros por división y búsqueda.
- [x] **29 fichas** en `/productos/[slug]`. *(`lib/productos-inventory.ts`)*
- [ ] Productos faltantes vs spec (ej. **PalaUp CH**, **PalaUp Meat**).
- [ ] URLs de productos en sitemap.

---

# DIVISIÓN ACUÍCOLA

## ActiveMOS

Fabricante: Biorigin

Imagen:
https://biorigin.net/es/activemos-animales-de-produccion/

Función:
Prebiótico MOS derivado de Saccharomyces cerevisiae.

Beneficios:
- Modulación intestinal
- Salud digestiva
- Mejora microbiota

- [~] Ficha ActiveMOS — sin fabricante/marca en UI

---

## Macrogard

Fabricante: Biorigin

Imagen:
https://biorigin.net/es/macrogard-animales-de-produccion/

Beneficios:
- Inmunomodulación
- Menor estrés
- Mayor resistencia sanitaria

- [~] Ficha Macrogard — sin fabricante/marca en UI

---

## Nucleoforce Salmonids

Fabricante: Bioiberica

Imagen:
https://www.bioiberica.com/es/productos/salud-animal/nucleoforce-aqua-hf

Beneficios:
- Desarrollo inmunitario
- Salud digestiva
- Mejor respuesta vacunal

- [~] Ficha Nucleoforce Salmonids — sin fabricante/marca en UI

---

## Silimarina 80%

Beneficios:
- Protección hepática
- Acción antioxidante
- Regeneración celular

- [~] Ficha Silimarina — sin fabricante/marca en UI

---

# DIVISIÓN AVES

## ActiveMOS
## Halor TID
## Meatfree
## Microacid Plus
## Microacid EOils
## M-Prove
## PlusBreathe+
## S-Prove
## Tecmax Pro
## Turbozyme FT EXP
## Turbozyme FT SD EXP
## Vitanox
## Vitaprotein 50 Plus

- [~] Fichas individuales — mayoría en inventario aves; validar copy/imagen/fabricante por SKU

---

# DIVISIÓN MASCOTAS

## ActiveMOS
## Macrogard
## Silimarina
## Nucleoforce Salmonids
## PalaUp CH
## PalaUp Meat
## Tecmax Pro
## Turbozyme FT EXP
## Turbozyme FT SD EXP

- [~] Fichas mascotas — solo 3 productos asignados a división mascotas en catálogo
- [ ] PalaUp CH / PalaUp Meat — **no en inventario**

---

# Diseño / Frontend

## Prioridad Alta

- [~] Navegación superior nueva.
- [ ] Dropdown soluciones.
- [~] Página nosotros.
- [ ] Página maquila (ruta dedicada).
- [~] CTA contacto actualizado.
- [~] Hero con control audio.
- [~] Reemplazo indicadores.
- [~] Actualización footer. *(Nosotros añadido; falta Maquila en Soluciones)*
- [~] Sistema de fichas de producto.

## Prioridad Media

- [~] Mejorar imágenes verticales.
- [~] Optimizar UX móvil.
- [x] Scroll navigation lateral — **eliminado** (decisión v0.4; spec original lo pedía mejorar, no quitar).
- [~] Microanimaciones.

## Prioridad Baja

- [ ] Comparador de soluciones.
- [ ] Descarga PDF por producto.
- [ ] Biblioteca técnica.

---

# Extras implementados (fuera del spec v2)

- [x] Página `/impacto` (contenido completo; nav incluye Impacto)
- [x] Certificaciones SGS + REP en homepage
- [x] Sección proceso + scroll frames pellet (`ImpactSection` en `/soluciones`)
- [x] Páginas legales `/legal/privacidad` y `/legal/terminos`
- [x] Sitemap básico (`app/sitemap.ts`)
- [x] Assets organizados por componente (`lib/public-assets.ts`, `public/assets/`)

## Pendientes técnicos transversales

- [ ] `robots.txt` / Open Graph / JSON-LD
- [ ] Formulario contacto → backend real
- [ ] WhatsApp / LinkedIn URLs finales en footer

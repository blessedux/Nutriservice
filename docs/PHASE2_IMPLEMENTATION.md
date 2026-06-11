# Phase 2 Implementation Guide — Asset Replacements

This guide documents how to integrate the pending assets once they're provided by NutriService.

---

## 1. Replace Aves Video (Industrial Production)

**Current asset:** `public/assets/division-video/aves-chickens.webm`

**Steps:**
1. Place new video(s) in `public/assets/division-video/`
   - Filename: `aves-industrial.webm` (and optional `.mp4`)
2. Update `lib/public-assets.ts`:
   ```typescript
   divisionVideo: {
     // ...
     aves: "/assets/division-video/aves-industrial.webm",
   }
   ```
3. Test on:
   - `/industrias/avicola` page (background video)
   - `/productos` page (division filter background)
   - Homepage industries section if applicable

---

## 2. Product Logos

**Current:** Generic pellet/powder stock images in `lib/productos-images.ts`

**Steps:**
1. Place product logo files in `public/assets/productos/`
   - Naming: `{product-slug}.webp` (e.g., `activemos.webp`, `macrogard.webp`)
   - Format: WebP or PNG, transparent or white background
   - Consistent aspect ratio recommended

2. Populate `PRODUCT_IMAGE_BY_SLUG` in `lib/productos-images.ts`:
   ```typescript
   const PRODUCT_IMAGE_BY_SLUG: Partial<Record<string, string>> = {
     activemos: "/assets/productos/activemos.webp",
     macrogard: "/assets/productos/macrogard.webp",
     // ... add all 29 products
   };
   ```

3. Alternative: Set `imageSrc` directly in `lib/productos-inventory.ts` per product if needed for overrides

4. The component `components/producto-image.tsx` will automatically use these instead of fallback stock images

---

## 3. Nutriservice-Branded Bag

**Current:**
- Default pellet stock: `public/assets/shared/pellet2.webp`
- Scroll sequence: 121 frames in `public/assets/impact-section/pellet-frames/`

**Steps:**

### Option A: Single static bag replacement
1. Place branded bag image: `public/assets/shared/nutriservice-pellet.webp`
2. Update `lib/public-assets.ts`:
   ```typescript
   shared: {
     // ...
     pellet2: "/assets/shared/nutriservice-pellet.webp",
   }
   ```

### Option B: Full scroll sequence rebrand
1. Replace all 121 frames: `public/assets/impact-section/pellet-frames/frame_NNNN.webp`
2. Keep same naming convention (frame_0000 to frame_0120)
3. No code changes needed if naming matches

**Affected areas:**
- Product catalog default images
- Homepage impact section scroll animation (if Option B)

---

## 4. Contact Page Photo

**Current:** `public/assets/shared/workers-hero.webp`

**Steps:**
1. Place new photo: `public/assets/shared/nutriservice-team.webp` (or similar name)
2. Update `lib/public-assets.ts`:
   ```typescript
   shared: {
     // ...
     workersHero: "/assets/shared/nutriservice-team.webp",
   }
   ```
3. Used in `components/contact-page-layout.tsx` (automatically updates)

---

## 5. Product Reclassification (ProductosCategorias.xlsx)

**Current:** Inventory in `lib/productos-inventory.ts` uses existing division/category assignments

**Steps:**
1. Place spreadsheet: `docs/ProductosCategorias.xlsx` or project root
2. Read spreadsheet data (columns expected: Product Name, Slug, Acuícola, Aves, Cerdos, Mascotas, Categories)
3. Update `lib/productos-inventory.ts`:
   - Modify `divisionSlugs` arrays per product
   - Update `filterSlugs` arrays per product
   - Focus on **cerdos, aves, mascotas** divisions as specified in feedback

4. Cross-reference with `docs/catalogo-productos.md` for validation
5. Test product catalog filters after changes

**Products to verify:**
- All 13 Aves products
- All 19 Cerdos products  
- All 4 Mascotas products
- Check alphabetical ordering still works (already implemented in Phase 1)

---

## 6. Division-Specific Contacts

**Current:** Placeholder structure in `lib/division-contacts.ts` uses general SAC email/phone

**Steps:**
1. Update `DIVISION_CONTACTS` in `lib/division-contacts.ts`:
   ```typescript
   export const DIVISION_CONTACTS: Record<ProductoDivisionSlug, DivisionContact> = {
     acuicola: {
       name: "María González",  // Replace with actual name
       email: "acuicola@nutriservice.cl",  // Replace with actual email
       phone: "+56 9 1234 5678",  // Optional
     },
     aves: {
       name: "Juan Pérez",
       email: "aves@nutriservice.cl",
       phone: "+56 9 8765 4321",
     },
     // ... cerdos, mascotas
   };
   ```

2. The UI component `components/division-contact-block.tsx` automatically reflects changes
3. Appears on all 4 industry pages above the #contacto CTA section

---

## Quick Reference: Asset Checklist

- [ ] Aves industrial video (`.webm` + optional `.mp4`)
- [ ] 29 product logos (`.webp` or `.png` per slug)
- [ ] Nutriservice-branded bag image (static or 121-frame sequence)
- [ ] Contact page team photo (`.webp`)
- [ ] ProductosCategorias.xlsx spreadsheet
- [ ] Per-division contact details (name, email, optional phone)

All infrastructure is ready — just drop assets in the documented paths and update the configuration files as noted above.

---
title: Blueprint Narrative (Stitch Design System)
projectId: "17796523501615845536"
assetId: "0ce6fd8ff3454b6882c866cb253712dc"
source: "Stitch MCP (list_design_systems)"
---

## Design tokens + guidelines

(Extracted from Stitch MCP. This is the `designMd` payload.)

## Brand & Style

This design system adopts a **Lo-fi / Brutalist-Minimalism** hybrid style. It is designed to function as a high-fidelity wireframe that emphasizes structure, hierarchy, and spatial relationships over decorative polish. The aesthetic is raw, intentional, and editorial, drawing inspiration from architectural blueprints and studio process documentation.

The brand personality is transparent and utilitarian. By stripping away surface-level distractions, the design system focuses on the "skeleton" of the content, using high-contrast boundaries and grayscale tones to guide the user through complex studio workflows and case studies. It evokes a sense of "work in progress" that is both professional and avant-garde.

## Colors

The palette is strictly functional. **Black (#000000)** is used for all structural elements, borders, and primary text to establish a rigid framework. **White (#FFFFFF)** serves as the expansive negative space, maintaining an airy, studio-like atmosphere.

**Lavender (#C496FF)** is reserved exclusively as a "system-active" or "focal point" color. It should be used sparingly for interactive highlights or to draw attention to specific CTA wireframe blocks. To maintain the lo-fi aesthetic, all image placeholders are rendered in a medium-gray tint, and secondary UI elements use varying shades of grayscale to denote hierarchy without introducing hue.

## Typography

The typography strategy mirrors the structural rigour of the brand. **Epilogue** is used for massive, impactful headlines that anchor each section, reflecting the "Right" font's presence in the source material through its distinctive geometric character.

**Inter** provides a neutral, highly legible base for body copy and descriptions, ensuring the "wireframe" feel remains functional. **Space Grotesk** is utilized for labels, technical metadata, and navigational elements, providing a subtle "tech-studio" inflection. Type should be treated as a spatial element; use extreme scale differences to create focus.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy with a 12-column structure. Following the Erthos Studio proportions, the design utilizes significant vertical breathing room ("section-gap") to separate distinct phases of content.

Boundaries between sections must be explicitly defined by 1px solid black lines or 2px borders for major breaks. Content blocks often span 6 or 12 columns to maintain a bold, editorial rhythm. Alignment is strictly left-justified for text, while image placeholders (aspect-ratio locked boxes with "X" centered) can vary in width to create an asymmetrical, dynamic flow.

## Elevation & Depth

This system avoids shadows and translucency to preserve the flat, lo-fi aesthetic. Depth is achieved through **Bold Borders** and **Tonal Layering** within the grayscale spectrum.

- **Primary Surface:** White (#FFFFFF).
- **Secondary Surface:** Very light gray (#F2F2F2) for nested containers or subtle section backgrounds.
- **Structural Lines:** 1px Black (#000000) borders define all components and sections.
- **Z-Index:** Content is visually "stacked" using thick borders; an element with a 2px border appears "above" one with a 1px border. No blurs or ambient shadows are permitted.

## Shapes

The shape language is **Sharp (0px)**. Every element—buttons, image placeholders, input fields, and containers—must have hard 90-degree corners. This reinforces the architectural, technical drawing aesthetic and distinguishes the design from consumer-facing "soft" interfaces. Consistency in corner sharpness is critical to maintaining the blueprint narrative.

## Components

- **Buttons:** Rectangular with a 1px or 2px black border. The "Primary" state fills with Black and flips text to White. The "Hover" state uses the Lavender (#C496FF) fill.
- **Image Placeholders:** Light gray boxes with a diagonal "X" connecting the corners. Include the aspect ratio or image name in small `label-caps` text in the center.
- **Cards:** Simple 1px bordered containers.
- **Input Fields:** Bottom-border only (1px black) with `label-caps` floating above.
- **Chips/Tags:** Sharp-edged boxes with `label-caps` text.
- **Section Dividers:** 1px horizontal lines that span the entire container width.


# Brochure-led web typography

The original `sure-mechanical_brochure-6x9 FINAL.pdf` was re-read on November 22, 2026. Font metadata on pages 1–3 names **EurostileBold** and **KabelITCbyBT-Book**; page 4 uses Kabel Book. These are embedded PDF subsets, not supplied standalone webfont files.

The website uses **Michroma** for its squared display headings and **Outfit** for geometric, readable body text, controls and small headings. These are visual web counterparts, not claims to be the exact print fonts. Existing logo artwork is unchanged.

Both families are self-hosted by `next/font`, with Latin subsets, swap display and preloading. Their variable classes live on the HTML root so root-level typography tokens resolve correctly. The browser makes no Google Fonts request. Original OFL notices are retained under `public/fonts/`.

Sources:
- Brochure: https://drive.google.com/file/d/15CxR0fC-ol5sH52B8a1iX-45s5lGUKUd/view
- Michroma: https://github.com/google/fonts/tree/main/ofl/michroma
- Outfit: https://github.com/google/fonts/tree/main/ofl/outfit

Presentation changes preserve all existing words. Heading entrances use clipped word spans with a single accessible text equivalent, and skip motion when reduced motion is preferred. Short measures, balanced wrapping, directional photo scrims, section rules, numbered values/service items and equipment labels create hierarchy without adding slogans.

Validation: Pages build/TypeScript, lint, existing browser suite, timeline motion regression and typography checks. Typography checks cover actual loaded font families, accessible title, unclipped words, light/dark, 320/390/768/1440 widths, enlarged text and reduced-motion restoration. A separate visual UX reviewer independently scrolled phone/desktop layouts and rechecked the timeline after font metrics changed. The reviewer found and verified a targeted fix for bright-photo headline contrast before publication.

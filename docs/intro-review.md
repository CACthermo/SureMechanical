# Hero and supplied assets — November 14, 2026

- Existing 1.7 MB hero PNG replaced on homepage with an approximately 82 KB WebP, marked priority/high fetch priority and preloaded by Next.js. A tiny inline blurred copy supplies an immediate photographic background while the main asset loads. Browser scheduling/network latency cannot be guaranteed, but the hero is explicitly prioritized.
- Main image load triggers a 1.7 second soft gradient-mask/opacity/blur reveal. Title starts 0.75 seconds later; supporting copy/actions follow at 1.6 seconds. Navigation stays available. Keyboard focus exposes actions immediately. Cached image, failed image, five-second stall escape, no-JavaScript and reduced-motion fallbacks preserve content access.
- Uploaded IMG_8378.jpeg is optimized as service-background.webp, behind a theme-aware veil for readable text.
- Uploaded IMG_3465.webp is optimized as SURE_Group_horizontal.webp beside the unchanged SURE System heading. Its black backing is preserved, keeping white lettering visible in both themes.
- Assets are faithful resized/compressed derivatives; no generative edits. Portfolio photos unchanged.
- Validation: lint and static build; 390/768/1440 browser suite, delayed-hero sequence and failed-hero fallback tests. Forms intercepted; no company inquiries sent. Asset Git blob hashes match local files.

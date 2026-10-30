# October 2026 website update

Review branch: `sure-client-updates-oct2026` in `CACthermo/SureMechanical`, targeting `main` through PR #5. Production publication requires review and approval.

## Final experience

The website uses a light default and the original navy/teal dark palette through a persistent theme control. A shorter, static page explains the company, services, project work, related companies, careers, and contact options in plain language. The technical process timeline, equipment readouts, floating labels, scroll pinning, duplicated capability chapters, and unused animated styles have been removed.

General and HR forms use the two supplied Formspree endpoints. They retain accessible labels, required/email/whitespace validation, a honeypot, loading lock, a 20-second timeout, and success/error feedback. Failed requests retain the message. Start a Project links open `bidinvites@suremechanical.com`; HR links open `lhammer@suremechanical.com`.

## Portfolio source and matching

- The Project list contains all 20 job/customer pairs supplied by Max, without invented descriptions, industry categories, dates, results, or detailed scopes.
- The Project photos view contains nine collections using all 14 client photos. Cards open a gallery with previous/next arrows, thumbnails, keyboard navigation, Escape/backdrop dismissal, focus containment/restoration, scroll locking, and touch swipes.
- Each image is assigned to one photo collection. The same collection may be opened from its corresponding directory record; photos are not shared between unrelated jobs or other site sections.
- Findlay Community Center, CH Winslow Research Facility, UC Digital Futures, and Renovation Kenton Elementary have matching collections. UC Digital Futures includes three supplied views and remains separate from the distinct Uptown Gateway - Digital Future contract.
- Federal Reserve, UC MAB, Bethesda Arrow Springs MRI, Duke Energy, and Dayton Police Station remain photo collections under the supplied labels, with no invented customer. The Federal Reserve collection is deliberately not attached to the abbreviated `FRB of Clyd - AHU Rebuild GMP` record until that alias is confirmed.
- The uploaded building sign reads **Winslow Research Pavilion**, supporting the original Winslow spelling. The source job name remains `CH Winslow Research Facility`.
- The only detailed project scope displayed is Max's Duke Energy statement: assembly of two air handling units, each with 8,000 rivets. Other scopes are null.
- `docs/project-photo-source-map.json` records original filenames, upload labels, hashes and web asset paths. Originals remain unchanged. Faithful resized WebP derivatives are committed; four obsolete placeholder photos were removed.

To regenerate assets from the original supplied files:

```sh
node scripts/prepare-project-photos.mjs /path/to/originals
```

## Copy and usability review

Company copy was checked against the uploaded `Sure Mechanical.docx` and work instructions. The final page retains supported design, HVAC, sheet metal, piping, installation, service/controls, workforce-development, and company-history information. It removes the fabricated hospital/office/laboratory case studies, unsupported performance promises, sample equipment sizes, stale employee-count statistics, and repeated technical language. The design introduces no testimonials, awards, project outcomes, or engineering values.

Plain-language service summaries explain HVAC and 3D building coordination. The project list preserves supplied job abbreviations rather than guessing at truncated names; an optional glossary explains HVAC, AHU and RTU. CAC and the other company logos sit on opaque white panels in both themes. The header displays the supplied wordmark without its transparent padding shrinking it.

The earlier implementation consulted the live StarrTree Motherboard on October 30. This revision carries forward its stable DOM reading order and restrained visual hierarchy; no third-party showcase code or additional animation runtime was added.

## Validation

Use the committed Bun lockfile. Browser tests intercept Formspree traffic and send no messages to company recipients.

```sh
bun install --frozen-lockfile
bun run db:generate
GITHUB_PAGES=true bun run build:pages
bun run lint
bunx playwright install chromium
bun run test:browser
```

`test:browser` serves `out` on an ephemeral local port. `TEST_BASE_URL` can target another existing server. `BROWSER_EXECUTABLE_PATH` can select an installed Chromium binary. Optional `SCREENSHOT_DIR` must name an existing directory.

The suite checks 390px, 768px and 1440px layouts, light/dark persistence, blocked storage, anchor/mailto destinations, all 14 image decodes, photo search, the 20-job directory, distinct Digital Futures contracts, unresolved Federal Reserve matching, arrows/thumbnails/swipes, keyboard focus and Escape, and both forms' invalid/loading/success/server-error/network-error states. Normal-motion page checks are also included. Screenshot inspection covers desktop/phone hero, portfolio and forms in both themes.

This local environment requires `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` for Google Fonts fetching. Prisma client generation is needed on a fresh install. These are validation steps, not hosting changes.

## Before publication

- Review the completed visual layout, supplied project names/customer pairs, and remaining abbreviated job names.
- Confirm the Federal Reserve photo alias and provide customer information for photo-only collections when available. Missing descriptions stay omitted.
- Confirm Formspree recipient settings and deliberately test actual inbox delivery for both forms. Intercepted browser tests do not prove delivery.
- Perform a real-device/iOS Safari review.
- Approve the PR before merging or deploying to production.

The two pre-existing GitHub Pages workflows deploy pushes to `main`; neither provides a branch preview. Deployment workflows, production hosting, repository ownership, and DNS are unchanged.

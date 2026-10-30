# October 2026 client updates

Prepared for review in `sure-client-updates-oct2026`, targeting `main` in `CACthermo/SureMechanical`.

## Behavior

- Light is the default: white/light gray surfaces, teal accents, silver details, and dark text. The existing midnight palette remains available through the persistent sun/moon control.
- General inquiries post to `https://formspree.io/f/mkjjzrrw`; careers/HR inquiries post to `https://formspree.io/f/mpppldpv`. Required fields, native email validation, whitespace checks, a honeypot, loading lock, a 20-second timeout, success feedback, and recoverable error feedback are included. Failed requests retain entered content.
- All Start a Project links open `bidinvites@suremechanical.com`. HR email links open `lhammer@suremechanical.com`. Navigation and footer links point to existing destinations.
- The Fabrication showcase/component, its process entry, section-number prefixes, bottom 01–10 timeline, and floating People & Safety labels are removed. Legitimate prefabrication and company capability information remains.
- Project cards show full-brightness imagery above text. Research filtering uses the same category value as the data; filters derive from actual entries. The detail dialog supports focus containment, Escape, backdrop dismissal, body scroll locking, and focus restoration.
- Project data lives in `src/lib/projects.ts`. Four existing source images each occupy one slot. The two remaining slots use graphic placeholders. No project photo is used outside the portfolio. Every name, scope, company assignment, and image match remains preliminary until leadership confirms it.
- Nonportfolio areas use existing brand assets and original schematic/CSS treatments. CAC appears on white. Phone layouts avoid the pinned company animation; reduced-motion visitors receive static content.

## Implementation direction

The established Next.js/React/GSAP design is retained. The chosen approach is a light technical editorial layout with schematic graphics and conventional contact paths. A photo-led design depends on confirmed company media; the original dark visual language remains selectable. No additional animation framework was introduced.

The current StarrTree Motherboard's Start Here, Design Language Matrix, Inspiration Board, Resources, and GitHub Deep Dives were consulted on October 30, 2026. The relevant principles were a stable DOM reading order, restrained technical drawing treatments, and static mobile/reduced-motion alternatives. No third-party showcase code was copied.

## Validation

Use the committed Bun lockfile. Browser tests intercept all Formspree traffic and send no real messages.

```sh
bun install --frozen-lockfile
bun run db:generate
GITHUB_PAGES=true bun run build:pages
bun run lint
bunx playwright install chromium
bun run test:browser
```

`test:browser` serves the `out` export on an ephemeral local port. To test another existing server, set `TEST_BASE_URL`. To use an installed Chromium binary, set `BROWSER_EXECUTABLE_PATH`. Optional `SCREENSHOT_DIR` must name an existing directory.

Checks cover 390px, 768px, and 1440px layouts; default/persisted themes; blocked browser storage; navigation targets; mailto links; image decoding; unique photo assignments; Research filtering; modal keyboard behavior; required/invalid/whitespace form fields; loading; success; server rejection; and network failure. Normal-motion smoke checks also cover the hero and scroll sections.

The local environment required `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` for Google Fonts fetching. This is a local build setting, not a change to hosting.

Verified locally on October 30, 2026: the static production build, TypeScript check, ESLint, whitespace check, and browser suite passed. Chromium checks covered all three viewport sizes and both normal/reduced motion paths. Screenshot review included the light/dark hero, forms, and portfolio. Formspree responses were intercepted throughout; actual recipient delivery was not tested.

## Review before publication

1. Confirm all portfolio names, scopes, company assignments, and actual photo matches; supply the remaining unique project images.
2. Verify Formspree recipient settings and send one deliberate delivery test through each form. Browser response tests do not prove inbox delivery.
3. Review desktop and phone appearance in both themes. iOS Safari and real-device testing remain separate from Chromium checks.
4. Approve the PR before merging. No publication is authorized by this branch.

## Deployment inspection

The repository contains two existing GitHub Pages workflows that deploy pushes to `main`; neither provides a branch preview. These workflow files, production hosting, repository ownership, and DNS are unchanged. Review that pre-existing workflow duplication separately if publication needs troubleshooting. No preview hosting service was created.

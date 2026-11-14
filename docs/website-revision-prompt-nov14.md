# SURE Mechanical — consolidated development prompt (November 14, 2026)

PROJECT: SURE Mechanical website, final client revisions after the November 13 meeting.
REPO: `CACthermo/SureMechanical` (use authorized StarrTree write access).
REFERENCE: https://docs.google.com/document/d/1JdEjJo6lm4m4FtCcooT7SgqX_f_zq-a6mHbRSTwRucU
SOURCE: official SURE Mechanical 6×9 brochure, `sure-mechanical_brochure-6x9 FINAL.pdf`, plus client-provided brand images/OBJ models.

Implement all authorized SURE-site changes as one coherent development pass, retaining the existing Next.js visual language, published project photography, responsive contact UX and client-owned deployment setup. Inspect the live site, current repo and existing code before making edits. Create a PR for review and verify the built result. Do not publish unverified contact forms or make changes to the separate CAC repository in this run.

## 1. Critical contact-form diagnosis and fallback

Max's two live website tests and Chuma's test did not arrive by email **or appear in the expected Formspree submissions list**. This is not simply an Outlook routing failure. Do not mark it resolved without end-to-end evidence.

- The current account has **11/50 counted monthly submissions**, so the free quota is not exhausted; both `lhammer@suremechanical.com` and `bidinvites@suremechanical.com` are verified. The expired Business trial does not itself prove the forms are disabled.
- General and Start a Project both use `mkjjzrrw`; HR uses `mpppldpv`. Both dashboard workflows previously emailed Lesley. Desired routing: Project → bidinvites; HR → Lesley; General → Lesley. Separate the Project form endpoint or use a verified conditional routing option so General and Project do not inadvertently share one recipient.
- Inspect each form's **Inbox, Spam, Over Limit, restricted-domain/referrer settings, workflow events and any delivery errors**. The large historical red Spam count may reflect testing; do not assume malicious activity.
- Preserve accessible validation, entered fields after error, honest accepted-versus-delivered status, rate-limit feedback and duplicate-submit protection. Provide a native form submission fallback and a manual email path if AJAX cannot be confirmed.
- Test one clearly identified submission per department after settings are corrected. Success requires both a corresponding Formspree record and confirmation from the correct recipient inbox. Do not silently migrate to a paid vendor.

## 2. Make SURE Mechanical the unmistakable foundation

**SURE Mechanical is the website's main company**, established in **2010**. It is the founding company that developed the broader SURE Group family following the 2025 acquisition. **Do not call SURE Group the owner/parent of SURE Mechanical.** Replace any narrative in which the Group seems to be the primary contracting company. Keep SURE Mechanical as the hero, navigation identity, About story and dominant company brand.

- In 2025, SURE Mechanical acquired Cincinnati Air Conditioning Co.; client notes also describe the integration of Thermolinear into this related-company family. Use client-approved corporate wording and flag any unsupported legal relationships for confirmation.
- Make main menu text visibly bolder/larger, drawing from the confident typography and structure of CAC's existing website, while preserving SURE's own brand palette and personality.

## 3. SURE family blueprint animation — exact scroll sequence

Build an elegant, readable scroll-driven schematic with architectural/MEP ductwork aesthetics. Prioritize smoothness and legibility, and provide a complete static/mobile/reduced-motion version.

1. Begin with the **SURE Mechanical logo**, with **2010** appearing beside it as the founding year. Bring the founding logo to the center of the viewport as the story begins.
2. When centered, draw the first duct **straight down** from SURE Mechanical into the **SURE Group** logo, revealing the **2025** milestone and brief acquisition/family description. SURE Mechanical should also be visibly paired with SURE Group in this part of the illustration.
3. Draw a branching duct out of SURE Group into **two separate zigzag paths**, ending beneath it at **Cincinnati Air Conditioning Co.** and **Thermolinear**, whose logos reveal together at balanced visual sizes.
4. As scrolling continues, reveal concise, accurate descriptions of those two businesses.
5. From both logos, draw two return ducts downward, stepping together to a single central connection.
6. The terminal connection is a scaled top-down **RTU plan-view silhouette**, which transitions on scroll into a larger glowing cyan **3D/isometric hologram** with a subtle orbit/angle change. Max supplied `roofunit01.obj`; use this rooftop-unit model as the visual source. The two other OBJ assets are a remote control and a room air conditioner, not suitable substitute RTUs.
7. End with the exact intended closing message: **“Together the two companies have deep experience in Design Build, Plan & Spec, Engineering Systems, and Controlled Rooms.”**

Use a bounded GSAP/ScrollTrigger timeline already available in the project or an equally stable existing technique. Do not put giant WebGL payloads on the critical path. Make the desktop scroll beat sequence stable, mobile vertically readable, and reduced-motion complete without hidden content.

## 4. Exact brochure typography — verified from source PDF

**The source PDF embeds these two font families:**

- **Eurostile Bold** (PDF font: `EurostileBold`) — for large all-caps section headings such as `CONTACT`, `CORE VALUES`, `KEY SERVICES`, `SERVICE`, `CLIENTS & PROJECTS`, for major hero/headline text, and potentially the heavier navigation labels. This is the bold industrial/geometric display font.
- **Kabel ITC by BT Book** (PDF font: `KabelITCbyBT-Book`) — for paragraphs, descriptive body copy, contact/address lines and the smaller cyan section labels such as `Integrity`, `Teamwork`, `Commercial Equipment Service Department`, etc. This is the distinctive rounded, slightly geometric light text used throughout the brochure.

Carry the **Eurostile Bold heading + Kabel Book body** contrast throughout the site's typography. The light rounded Kabel should remain readable, not accidentally become ultra-thin at small screen sizes. Preserve the brochure's hierarchy, letter spacing and teal highlight color, with web-appropriate accessible contrast. Do not guess that the heading and body are one font.

**Licensing constraint:** identifying an embedded font does not grant web-embedding rights. Check whether authorized `.woff2`/`.woff`/desktop font licenses are available. If not, set documented fallback stacks and identify suitable licensable/lookalike alternatives for client approval; do not rip embedded glyphs out of the PDF, claim a fallback is exact, or purchase font licenses without approval.

## 5. SURE Mechanical story, service, photos and proof

- Use the brochure's genuine SURE About content, workforce commitment, service capabilities and seven core values in distinct, visually polished sections. Model the story presentation on the existing CAC Our Story page without making SURE seem subsidiary to CAC.
- Chuma will provide the deeper founding narrative for the Story page/section; do not fabricate it.
- Lesley is providing the photograph of the SURE logo mounted on a wall (strong candidate for the About background) and a photo of the service van (for the service department). Integrate when supplied; retain current approved images in the meantime.
- Add a striking section for approximately **10–15 significant clients/projects** documented in the brochure. The source list includes 3CDC, UC Health, TriHealth, Mercy Health, Dayton Children's Hospital, Messer, Cincinnati Shakespeare, Triversity, Megen Construction, Bethany Village, Danis and St. Elizabeth. Find official logo assets and verify each identity and usage rights; use accurately sized transparent PNG/SVG logos, not fabricated logos or unapproved endorsement language. A tidy typographic proof grid may be used as a temporary fallback until logos are approved.

## 6. QA and delivery gate

- Verify desktop and mobile visual hierarchy, menu boldness, image loading, reduced-motion state, company logos, scroll positions, RTU transition, contrast, no horizontal overflow, and form error/success paths.
- Build and typecheck, then capture viewport/animation checkpoints when supported.
- Keep client-owned production stable. Open a PR with source changes and a clear review checklist. Publish only when authorized after functional form delivery and required client copy/asset approvals.

## 7. Separate future CAC website edits (NOT part of this SURE repo change)

- Replace **“Backed by the strength of SURE Group”** with **“Backed by the strength of SURE Mechanical.”**
- Retain **Certified MBE** but remove the other requested certification badges/claims.
- Use: **“In 2025, SURE Mechanical acquired Cincinnati Air Co. Together the two companies have deep design-build, engineered systems, controlled rooms, and plan-and-spec experience.”**
- Remove: **“SURE Mechanical adds fabrication, BIM, plan-and-spec execution, and certified minority-owned business leadership.”**

# SURE Mechanical — November 14 revision pass

## Priority: contact forms (NOT VERIFIED FIXED)

Max, Chuma and Lesley reported missing submission notifications; Max also could not find two test inquiries or Chuma's inquiry in the expected Formspree submissions view.

Current live endpoint configuration:
- General: `mkjjzrrw`
- Start a Project: `mkjjzrrw` (same form as General)
- HR: `mpppldpv`

The supplied November 14 revision brief reports that both configured workflows emailing `lhammer@suremechanical.com`, the account has two verified email addresses (`lhammer` and `bidinvites`), and 11/50 monthly counted submissions. The monthly limit is not the present cause. Historical Spam entries may be staff tests; their cause has not been established. These are client-reported account facts, not an independently inspected dashboard in this run.

This code pass adds a deliberate native HTML POST fallback (separate tab, retaining the original entries), an explicit duplicate warning, and a manual email option after rejected/unconfirmed AJAX submission. No live inquiries were sent. The Formspree dashboard redirects to its sign-in page in this environment; Inbox/Spam/Over Limit, workflow events, restrictions and recipient inbox receipt could not be independently inspected.

Project submissions no longer use the General endpoint. `NEXT_PUBLIC_FORMSPREE_PROJECT_ID` must contain a separately verified project form ID; the General/HR IDs are explicitly rejected for that setting. With no dedicated ID, the project form retains fields and offers an email draft to bidinvites rather than sending to a known shared endpoint. General and HR retain their existing endpoints. After verification, set the GitHub repository Actions variable `FORMSPREE_PROJECT_ID`; the existing Pages build passes it as `NEXT_PUBLIC_FORMSPREE_PROJECT_ID` (a public form ID, not a credential). This PR does not change production or claim to repair provider settings.

Manual email is explicitly authorized by this revision brief and only offered as a fallback; it opens the visitor’s email client with their entries and requires the visitor to send. Applicant entries are not written to browser storage, logs, analytics, URL parameters or a database by this code. A mailto draft is handled by the visitor’s chosen email app. No credentials are embedded.

### Owner actions before confirming the fix

1. Check both form **Submissions → Inbox / Spam / Over Limit** for the timestamps and sender details of Max's two tests and Chuma's message.
2. Check project-level **Settings → Restrict to Domain**. If enabled for `www.suremechanical.com` only, correct the allowed domain to `suremechanical.com` (without `www`) according to Formspree documentation. Check browser Referrer-Policy and security/anti-spam controls before lowering protection.
3. Open any submission record and inspect its status and email delivery events, if exposed. Only if Formspree shows an accepted record should IT investigate Microsoft 365 quarantine or a mail-suppression/bounce issue.
4. Confirm exact recipient strategy: HR → Lesley; Project → bidinvites; General → Lesley. Because Project and General presently share one Formspree endpoint, separate notification routing requires a third form ID or a tested account-supported conditional rule. Two verified recipient emails are sufficient; do not pay merely to add a third form ID without verifying plan limits.
5. After routing/settings are corrected, re-test each form using an identifiable timestamp and verify both the Formspree record and recipient inbox.

Relevant Formspree docs:
- https://help.formspree.io/articles/troubleshooting/i-m-not-receiving-emails/
- https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain/
- https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/

## Brand/story and timeline

- SURE Mechanical (founded **2010**) is the client and originating company, not SURE Group.
- Per Max's new client wording, SURE Mechanical's **2025** acquisition of Cincinnati Air Conditioning Co. led to the broader SURE Group family; Thermolinear is described as a related company, without claiming a separate acquisition. Pending Chuma's founding-story details and any legal copy verification.
- Scroll narrative: SURE Mechanical → duct → SURE Group → two branches → CAC and Thermolinear → two return ducts → top-view rooftop unit → scaled isometric hologram and closing claim.
- The rooftop unit images are rendered from Max's supplied `roofunit01.obj`; these are lightweight prerendered 2D-to-3D perspective states rather than an interactive WebGL model. The provided remote-controller and room-air-conditioner models are not appropriate for the RTU endpoint.
- The source brochure contains **Eurostile Bold** and **Kabel ITC by BT Book** embedded font names (`pdffonts`). Web-embeddable font licenses/files were not supplied, so CSS references those families with system fallbacks. **Exact cross-device font appearance remains pending licensed font files or licensed substitutes.**
- `PartnerProof` currently uses text names drawn from the brochure's *Clients & Projects* list, not unverified logo artwork or endorsements. Replace with approved transparent logos after sourcing/permission checks.

## Still awaiting from Chuma / Lesley

- Chuma: full SURE Mechanical founding story for an Our Story page or larger section.
- Lesley: SURE logo-wall photograph; branded service-van photograph.
- Client team: approval of selected relationship logos or official source files, verification of acquisition wording, and three end-to-end provider/recipient contact-form tests after configuration is corrected.

## Separate future CAC changes (do not modify CAC here)

- Change *Backed by the strength of SURE Group* to *Backed by the strength of SURE Mechanical*.
- Keep only the MBE certification among the currently displayed certification list.
- Use the approved wording: *In 2025, SURE Mechanical acquired Cincinnati Air Co. Together the two companies have deep design-build, engineered systems, controlled rooms and plan-and-spec experience.*
- Remove the redundant *SURE Mechanical adds fabrication, BIM, plan-and-spec execution, and certified minority-owned business leadership* sentence.

## Typography review

No licensed Eurostile/Kabel web files were found in the repository or supplied attachments. The CSS uses the named brochure families only when already available, with Arial Black/Geist display and Trebuchet/Geist body fallbacks. These are not claimed to be an exact match. Potential alternatives for approval: Michroma for squared industrial headings (regular-only; not an exact bold Eurostile replacement), and Josefin Sans at readable 400–500 weight for Kabel-influenced geometric copy. Neither alternative is installed in this PR. Official licensing metadata reviewed November 14, 2026:
- https://github.com/google/fonts/blob/main/ofl/michroma/METADATA.pb (OFL)
- https://github.com/google/fonts/blob/main/ofl/josefinsans/METADATA.pb (OFL)
- https://github.com/googlefonts/josefinsans/blob/master/OFL.txt

## Creative implementation and asset manifest

Current live Matrix read: November 14, 2026, `🗣️ Design Language Matrix!A1:N8`, https://docs.google.com/spreadsheets/d/1ljrT6D9KpRr_KS5Eque_W9T88H4tqOjvUUiXWEubDeQ/edit . V006 (bounded scroll storytelling), V004 (holographic contour accent) and V007 (single focal object) informed the implementation. These are inspiration leads, not reused third-party source code. Three considered routes: (1) static editorial history, (2) native SVG duct narrative with a small prerendered RTU sequence, (3) interactive WebGL unit. Selected (2) to preserve the existing GSAP stack and avoid runtime 3D cost; route (1) is the responsive/accessibility fallback. Route (3) adds no required user action and was rejected.

| Asset | Provenance and role | Delivery / fallback |
| --- | --- | --- |
| `roofunit01.obj` | Supplied RTU; same vertices/faces as attached source, normalized line endings and trailing whitespace | Authoring source only, not fetched by the browser |
| `rtu-topdown.webp` | Rendered from RTU; centered plan view at terminal duct | 800×530 alpha, 4,364 bytes |
| `rtu-transition.webp` | Same mesh, intermediate camera | 800×530 alpha, 20,052 bytes |
| `rtu-isometric.webp` | Same mesh, isometric cyan material/edge tracery | 800×530 alpha, 20,590 bytes; complete static fallback |
| Company marks | Existing approved assets | Founder 2010 → paired Group 2025 → balanced CAC / Thermolinear; official external destinations retained |
| People/service photographs | Existing supplied crew portrait and AHU backdrop | Preserved; new wall/van photographs not supplied |

All RTU frames share dimensions, center and material; three layers total approximately 45 KB compressed / 5.1 MB decoded RGBA. They are lazy loaded below the portfolio. One bounded ScrollTrigger owns ducts, node reveals and crossfades. Desktop progress beats: founder centered → 2010/origin → 2025 pair → branches → descriptions → return ducts → plan → angle crossfades / slight 2D rotation / enlargement → exact closing copy. This is a three-angle prerendered transition, not an arbitrary interactive camera orbit. Narrow/short screens, reduced motion and no-JS show the complete linear story; media-query changes revert the timeline.

## Review boundary

Keep this PR unmerged. Provider account access, a verified project form ID, recipient receipts, exact licensed font files or substitute approval, deeper founding copy and wall/van images remain pending. The existing production site returned HTTP 200 during this run. PR #6 and the CAC repository were not edited.

## Verification results (November 14, 2026)

- `GITHUB_PAGES=true NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build:pages`: passed, including TypeScript and static export.
- `npm run lint`: passed.
- `npm run test:browser`: passed with Chrome Headless Shell. Widths 390 / 768 / 1440: hero order, seven values, 9 photo projects + 14 expandable names, search, gallery next-photo/Escape, hash targets, light/dark mode and horizontal-overflow checks.
- Mocked General / HR: rejected 422, rate-limited 429, HTTP 200 with `ok:false`, accepted `ok:true`, failed network, retained entries, native fallback POST in a separate tab and duplicate-submit guard. Project with no dedicated ID: no network submission, preserved entries and explicit email fallback. No live form POSTs or emails sent.
- Normal-motion desktop: founder, drawn branch paths, isometric transition and closing-message clearance checked. Complete linear rendering on mobile, short desktop, reduced motion and JavaScript disabled; changing reduced-motion preference reverts the scene. Delayed hero image and failed-image intro fallback also passed.
- Rendered visual review corrected an SVG filter bounding-box bug that hid vertical ducts and reserved space above the fixed thermal indicator to prevent closing-copy overlap.
- Screenshots: `docs/qa/nov14-*.webp`. Desktop timeline and mobile hero retain navigation and progress chrome. Tall mobile story/client detail captures omit fixed chrome and wait for image decode so all content can be inspected without screenshot stitching artifacts. These are local build screenshots, not production.

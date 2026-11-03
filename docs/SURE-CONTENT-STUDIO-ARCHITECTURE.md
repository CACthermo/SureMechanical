# SURE Content Studio architecture
The editor writes repository files. Website visitors load an ordinary Next.js static export. SURE owns its account, code, content, media and history. StarrTree can maintain the integration without becoming the owner of any service.

## Data and build

| Boundary | Implementation |
|---|---|
| Editorial UI | Root .pages.yml exposes Projects, Project Photos and Company Information. Hosted Pages CMS supplies login, email invitations, media picking and form validation. |
| Projects | One JSON file per stable ID. Separate gallery rows hold the asset, required alternative text and optional caption. Files may omit uncertain facts. |
| Media | One media source rooted at public/projects keeps existing 2026 assets selectable. The uploader opens in public/projects/uploads and uses generated names. The review guard admits new uploads only, preserving legacy images. |
| Compilation | scripts/build-content.mjs validates structured data with existing Zod and decodes images with existing Sharp. It checks formats, dimensions, byte limits, explicit filenames, ordinary files, duplicate job numbers, photo reuse and missing paths. It excludes drafts and atomically writes an ignored build input. |
| Optimization | Existing WebP URLs stay intact. Uploaded photos generate orientation-corrected WebP copies up to 1920 pixels, at content-hashed URLs under /_cms/. Git retains originals. Files under public, including unused or draft photos, are public. |
| Front end | The existing portfolio and company components consume generated JSON. Grid, regular view, directory, galleries, keyboard/swipe actions, forms, theme and responsive CSS remain in the existing framework. Staff text is escaped by React. No staff field accepts raw code, destinations or form configuration. |
| Publishing | Staff save commits on content-staging. A reviewer checks the diff, validation, static export and browser results. main requires company-applied protections. The existing deployment job depends on a successful build. The proposed main-only build guard also excludes manual workflow runs from other branches. |
| Limits | Email collaborators can edit the configured repository's content and media. Access is repository-scoped. Branch selection alone does not enforce authorization. The scheme relies on GitHub to prevent direct production writes. No native approvals, in-context site preview, custom login, or per-field staff roles are assumed. Media-library operations may be broader than the publication guard. |

## Production baseline and migration evidence

[Production run](https://github.com/CACthermo/SureMechanical/actions/runs/41079430190) succeeded for [41c0509](https://github.com/CACthermo/SureMechanical/commit/41c0509376738e7a52141bfae6cba1113a30a0af). The Next configuration chooses static export for GITHUB_PAGES=true and standalone otherwise. Image paths are root-relative on suremechanical.com. Existing project metadata, CSS, older source maps and originals are retained. No schema expansion was inferred from marketing copy.

There are **23 records, 19 numbered jobs, four photo-only records, nine galleries and 14 photos**. In [39bdc6f](https://github.com/CACthermo/SureMechanical/commit/39bdc6f068c873b6f1c405a55d0fef6672e9e889) the prior maintainer removed job 10, “Uptown Gateway - Digital Future” (MESSER CONSTRUCTION COMPANY), while adding MESSER to job 17 alongside HGC. The same change consolidated Federal Reserve photos under job 16. Earlier notes describe different matches. The migration follows the deployed version. Only SURE can confirm whether job 10 represented a distinct contract. No extra project or reassignment has been introduced. No approved public phone or street address was present in the rendered contact sections, so both fields start blank.

## Hosting and cost

[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) restrict using free Pages hosting to run an online business or a site primarily facilitating commercial transactions. SURE publishes portfolio information and solicits bids through forms. The hosting decision involves the purpose of that site even without checkout. Ask GitHub for written clarification or plan a business-suitable host. A CMS change does not resolve that policy question.

Optional Cloudflare Pages migration, separately authorized:

1. MIS inventories current DNS, HTTPS, Pages configuration, domain renewal and all email DNS records. Export the existing zone and agree on a rollback owner.
2. In a SURE-owned Cloudflare account open Workers & Pages → Create application → Pages → Import existing Git repository. Authorize only CACthermo/SureMechanical after separate approval. Choose static Next.js export, repository root, production branch main, build command `bun run build:pages`, environment `GITHUB_PAGES=true`, output `out`. Use the same Bun lockfile. Use preview deployments for approved review branches. Do not put confidential data on preview URLs.
3. Test the pages.dev host on phone and desktop, project search, images, direct URLs, anchors and forms. Verify Formspree allowed origins and actual delivery only in coordination with SURE. Compare build sizes to quotas. Validate apex and www handling before cutover.
4. On written cutover approval, configure custom domains and DNS using Cloudflare's displayed records. For an apex domain review Cloudflare's nameserver requirements and preserve MX, SPF, DKIM and other unrelated records. Verify TLS, redirects and inbox delivery, then disable the old deployment only after acceptance. If cutover fails, MIS restores the prior DNS and hosting configuration and verifies the last good site.

[Cloudflare static Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/) · [free limits](https://developers.cloudflare.com/pages/platform/limits/) · [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

The [Pages CMS vendor](https://pagescms.org/) advertises free hosted use and email invitations. Expected new CMS subscription is $0. Confirm actual installation terms before enabling it. SURE needs its existing GitHub account with Actions/Pages, the hosted Pages CMS GitHub App, two reachable individual work mailboxes, domain/DNS service, and its existing Formspree accounts/endpoints. Domain renewal and Formspree quotas or fees continue under existing agreements; bills were not inspected. No paid service is needed for this branch. Cloudflare Pages Free currently lists 500 builds/month and a 25 MiB limit per asset. A separately branded portal with the same content model, safe GitHub writes, sign-in, upload validation, review controls and supportable recovery is roughly 60–120 engineering hours plus maintenance, depending on authentication and preview requirements. A branded bookmark is minutes of work and still opens Pages CMS.

## Acceptance and recovery

Runbook: [setup and publishing](SURE-CONTENT-STUDIO-SETUP.md). [Staff instructions](SURE-CONTENT-STUDIO-STAFF-GUIDE.md). Review the full PR file list for the exact change manifest. Live hosted authentication, installations, invitation delivery, removal and actual Formspree inbox delivery need authorized acceptance. Working branch checks and screenshots do not establish those vendor-side outcomes.

### Implementation acceptance evidence

- Compared each migrated source record with the array at 41c0509, including nulls, customers, original photo order/alt, scope and array position. All 23 matched. Git reports no changes to the 14 original image files.
- Loaded .pages.yml through the upstream 2.1.8 parser and validator at [6f4e860](https://github.com/pages-cms/pages-cms/commit/6f4e860a35d934406580287e7042e5e111e207a1) and rendered its actual EntryForm and image uploader in an isolated local test. The surrounding page is a test harness. [Project fields](studio-editor.png) · [gallery fields](studio-gallery.png).
- Changed the job-17 title, replaced its first image with a 600px JPEG of the same photograph, and saved the form. The upload request used the CMS-generated filename and its real image bytes. Local test transport captured the payload for the separate GitHub QA branch; hosted sign-in and upload were not exercised. Reproduce with the QA branch and the setup guide commands.
- A signed-out GET to the hosted repository entry API returned HTTP 401. Authorized collaborator login, testing a signed-in uninvited identity, and branch-protection enforcement remain company acceptance steps.

# Final client review — November 13 meeting

## Sources
- Meeting notes: https://docs.google.com/document/d/1JdEjJo6lm4m4FtCcooT7SgqX_f_zq-a6mHbRSTwRucU
- Lesley Hammer, “FW: SURE Mechanical Brochure”, November 13, 2026; attachment `sure-mechanical_brochure-6x9 FINAL.pdf`, pages 2–3.
- Client's supplied revision brief; existing approved website and company background.

## Content review
- Hero now leads with SURE Mechanical, followed by the two sentences requested by the client. Installation follows immediately, then engineering, commercial equipment service, company story/values, projects, company family, people/safety and contact.
- Core-value descriptions are concise paraphrases of brochure page 3. The workforce commitment comes from page 2. No new formal mission statement or SURE acronym expansion is proposed.
- Service capabilities are from pages 2–3, including boiler installation/service. No response-time or service guarantee added.
- History uses the supplied 2010/original-company/broader-family sequence. No acquisition dates or ownership claims added. CAC's 1938 history is confined to its description.
- The SURE System primary heading and introductory copy are unchanged. Parent branding retained, SURE first in descriptions and central in the illustration, CAC logos balanced.
- People & Safety's repeated photo is removed. Lesley's specifically approved replacement photo remains pending; no substitute stock photo or public-facing “pending asset” panel is inserted.
- All project data and photos retained. Existing icon controls and More projects retained; search count now includes name-only matches.

## Contact diagnosis
General and project inquiries currently share `mkjjzrrw`; HR uses `mpppldpv`. A subject/category tag distinguishes project inquiries, but does not configure a separate notification recipient. Thus bid-invitation routing cannot be certified from frontend code. No recipient addresses are exposed on the public page.

Frontend changes: synchronous duplicate-submit guard, HTTP and JSON acceptance checks, rate-limit feedback, retained values on rejected/malformed/network/timeout responses, explicit category field. Success means accepted by Formspree, not delivery to an inbox. No submission data persisted in localStorage or analytics.

Public GET checks returned HTTP 403 for both endpoints. GET is not a submission, so this is inconclusive. No live POST tests were performed.

Authenticated account checks still required (no Formspree account/session/credentials supplied):
1. Confirm each form exists and its notification rule is enabled; inspect submission inbox, spam and delivery events for a reported missing submission.
2. Confirm general recipient with client, project recipient `bidinvites@suremechanical.com`, and HR recipient with Lesley. Verify linked recipient addresses. Create a separate project endpoint or an account-supported routing rule if those recipients differ.
3. Inspect allowed production domain/referrer settings; authorize a review origin only if needed. Check the monthly quota and over-limit inbox.
4. Inspect suppression/bounce status and Microsoft 365 quarantine with company IT. Distinguish accepted submission from notification delivery.
5. After configuration, obtain approval for one clearly labeled real inquiry per department and have recipients confirm receipt.

Keep Formspree while diagnosis is incomplete. Replacement has not been established as necessary, so no provider switch or paid service introduced. If account remediation is impossible, compare alternatives and request approval before migration.

Official troubleshooting references:
- https://help.formspree.io/articles/troubleshooting/i-m-not-receiving-emails
- https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain/
- https://help.formspree.io/articles/account-management/account-limits
- https://help.formspree.io/articles/form-and-project-settings/system-limits

## Release gate
Client content approval, Lesley's replacement photograph, recipient/routing verification and an approved delivery test are outstanding. PR only: do not merge or deploy production. PR #6 Content Studio is not modified.

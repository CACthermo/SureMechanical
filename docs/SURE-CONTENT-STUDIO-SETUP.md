# SURE Content Studio setup
StarrTree Site Manager for SURE Mechanical. SURE leadership designates staff editors and authorizes public material. Max Starr reviews and accepts repository changes and authorizes merges, releases and recovery actions. Repository work through the GitHub connector uses the connected CACthermo account for CACthermo/SureMechanical. Account-level setup requires the appropriate administrator permissions and explicit approval from Max. Jon Bell has no approval role in this SURE workflow.

## Before connecting anyone

1. In GitHub open **CACthermo/SureMechanical → Settings → Rules → Rulesets → New branch ruleset**. Set enforcement to **Active**, target the default branch `main`, and leave the bypass list empty (especially the Pages CMS App). Require a pull request, one approving reviewer other than the author, dismissal of stale approvals, resolution of conversations, and required check **Validate and test SURE website** from GitHub Actions. Select this check after its first successful run. Block force pushes and deletions. Verify a separate authorized reviewer can approve. If an account plan or rule makes this impossible, pause invitations.
2. Add a separate active rule targeting `feature/sure-content-studio-mvp` to block force pushes and deletion. Use the same protections for `content-staging` once created. Staging must permit normal content commits. Branch creation by itself does not enable GitHub protection. The repository connection used to prepare this change has no rule-management tool.
3. In Settings → Environments → github-pages, restrict deployment branches to **main**. Inspect the Actions baseline and the implementation PR. This repository is public. Only cleared public data and images may be put on any branch, including draft records. The branch selector is a convenience, not a security boundary.

## Install and sign in (separate approval)

1. After Max explicitly approves the installation, visit [Pages CMS](https://app.pagescms.org), choose GitHub sign-in, and authenticate with the company-controlled CACthermo account. Review the OAuth consent and installation permissions. Do not copy credentials into a file.
2. Follow **Install GitHub App**, or open the [official GitHub App](https://github.com/apps/pages-cms). Choose **CACthermo → Only select repositories → SureMechanical**. Confirm the resulting scope is exactly **CACthermo/SureMechanical**. If already installed, inspect its current access before making a change. Avoid replacing any unrelated installation's repository selections.
3. Return to the editor, choose **CACthermo → SureMechanical**, then select **feature/sure-content-studio-mvp** for owner acceptance. Expect **Projects**, **Company Information**, and the **Project Photos** media source. If prompted to create a config, stop and check the branch. Never create a config on main as a workaround.
4. Following authorization, the maintainer can create **content-staging** from the accepted implementation, including before the initial production release for acceptance. Give staff the bookmark copied from the editor while this branch is selected. After the initial reviewed release, bring staging up to date with main before further edits.

## Invite exactly two designated employees

1. Obtain the two approved individual work email addresses from SURE leadership and confirm Max Starr as the publishing reviewer. Do not give employees the company GitHub login.
2. As the signed-in repository manager in Pages CMS, open the repository's **Collaborators** screen. Select **Invite**, enter the first approved address and **Send invite**. Repeat for the second. Check the invitation list for both addresses.
3. Each employee opens their own invitation email, signs in using the invited address and the emailed verification code, claims the invitation, and opens the staging bookmark. An employee using a separate GitHub identity with write access retains those GitHub privileges; use email-only collaborators for this workflow.
4. Have each editor verify the repository and branch, find an existing project, and locate the image uploader. Check that configuration and collaborator management are unavailable. With an uninvited test identity, verify an attempted repository write is denied. Verify direct writes to main are blocked by inspecting effective rules and using GitHub's rule evaluation or a protected disposable test branch with equivalent rules. Do not submit a test write to unprotected main.
5. Stop onboarding on unexpected access or fees. Owner authentication, installation, invitations, email delivery, revocation and live authorization checks require company participation.

## Review and publish

Staff follow the [staff guide](SURE-CONTENT-STUDIO-STAFF-GUIDE.md) for the actual edit. Save on staging, then notify Max Starr. The maintainer opens **Pull requests → New pull request**, base **main**, compare **content-staging**. Confirm the diff changes only project JSON, company JSON and newly added project photos. Replacing a photo means uploading a new file and changing the reference. Archive a project with its visibility switch. The review check rejects staff changes to other paths, image overwrites and file deletions.

Read validation errors under **Checks → Validate and test SURE website**. Download the screenshot artifact from the successful Actions run. For an interactive review the maintainer checks out the branch, runs the commands below, and serves the export locally. The staff member and reviewer can review together. No hosted branch preview is provisioned by the current Pages workflow.

After leadership approves the production release and all checks pass, Max merges the reviewed PR or explicitly authorizes the maintainer to do so. Verify the **Deploy Next.js site to Pages** run succeeds, the live site shows the expected project, its photos decode, and the three contact paths open the correct on-site forms. Synchronize main into content-staging after publication. Do not merge the QA demonstration branch.

## Reproduce checks

Use a clean checkout, Node 22 LTS or newer and Bun 1.3.6. The build fetches the existing Google fonts and uses the committed Bun lockfile.

```sh
bun install --frozen-lockfile
bun run content:validate
bun run test:content
bun run lint
GITHUB_PAGES=true bun run build:pages
bunx playwright install --with-deps chromium
bun run test:browser
python3 -m http.server 4173 --bind 127.0.0.1 --directory out
```

Open http://127.0.0.1:4173 for review. For local content edits, rerun the build or restart `bun run dev`. Normal production edits only require saving content, review and merge.

## Recovery and offboarding

- **Before release** close the PR or fix the entry on staging. A failed validation or build cannot advance the deploy job. For a deleted image restore the exact original path and bytes from Git history.
- **After release** open the merged PR and select **Revert → Create pull request**. Review the inverse diff, run the checks and authorize the rollback merge. If a revert conflicts, Max coordinates a recovery branch from current main and restores only affected paths from the last good commit, then opens a PR. Preserve subsequent unrelated work. The pre-CMS production baseline is `41c0509376738e7a52141bfae6cba1113a30a0af`. Never reset main or force-push it.
- **When someone leaves** open Pages CMS → repository → Collaborators, choose the individual, **Remove**, and confirm. Revoke pending invites as appropriate, remove any separate GitHub repository access, and disable the corporate mailbox with SURE's mailbox administrator under company policy. Verify a fresh session cannot edit. Removing only the CMS collaborator will not remove independent GitHub privileges.
- **Retire the editor** by removing this repository from the Pages CMS GitHub App installation after approval. The repository retains all website data and photos.

Vendor references: [Quick start](https://pagescms.org/docs/quick-start/), [collaborators](https://pagescms.org/docs/configuration/collaborators/), [authentication](https://pagescms.org/docs/development/authentication/).

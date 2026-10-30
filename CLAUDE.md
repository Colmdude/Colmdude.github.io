# CLAUDE.md: standing rules for this project

Photography portfolio for Coleman Calmus. Plain HTML/CSS/JS, no framework, no database. Hosted on Vercel (static).

## Every session
1. Read `HANDOFF.md` first. It is the only place status lives.
2. Check its header and top LOG line against `git log`; say so if they disagree.
3. Check any step you are about to propose against the DONE list so nothing repeats.
4. Summarize where things stand in five lines, then ask what to work on.
5. "resume" from the user means exactly this.

## Safety rules
- Branches and pull requests only. Never commit to `main`. The user merges, never Claude.
- Never force-push. Never rebase someone else's branch; merge `main` into it instead.
- Stage files by name (`git add path/file`), never `git add .` or `-A`.
- **Never lose the originals.** `originals/` holds the full-size photos, is gitignored, and must exist in a backup outside this folder. Never delete, overwrite or re-compress anything in it. Web sizes are generated from it into `site/img/`.
- Never print or commit keys. No `.env` values in chat.
- Ask before anything that touches an account, DNS, a domain or money. Say what you need from the user, then stop.
- Back up (save a patch outside the repo) before throwing away uncommitted work.
- Work on copies (a temporary worktree) when resolving conflicts.
- One step at a time. Every task block ends with "Report briefly, then wait."
- Explain the concept before the command. The user is a beginner developer: exact clicks, exact commands, and define words like "worktree" in a line.
- Commit with the user's GitHub no-reply email; set the repo author email early.

## Build rules
- Drop photos in `originals/`, then run `python3 scripts/build_images.py`. `content/photos.json` is optional (alt text, captions, order). Never hand-edit `site/img/` or `site/full/`.
- Every photo should get real alt text in `content/photos.json`; the filename fallback is only a safety net.
- Before any PR: run the build script, check 390px and desktop screenshots, check page weight (budget: first view under 1.5 MB of images), no console errors.

## Decisions
- The site's job is the photos. Type stays quiet.
- Look: dark navy background, orange Barlow caps (kept from v1).

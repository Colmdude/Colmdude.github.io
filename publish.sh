#!/usr/bin/env bash
# Publish new photos: build, show what changed, commit on a dated branch, push, open a PR.
# Never pushes to main and never merges. You merge the PR yourself on GitHub.
#
# Usage (from the project root):  ./publish.sh
set -euo pipefail
cd "$(dirname "$0")"

command -v gh >/dev/null || { echo "Needs the GitHub CLI (gh), logged in."; exit 1; }

echo "Building..."
python3 scripts/build_images.py

# Only these folders are published: the built site and the optional alt text / captions.
changed=$( { git ls-files -m -o --exclude-standard -- site content; git ls-files -d -- site content; } | sort -u )
if [ -z "$changed" ]; then
  echo "Nothing changed. Nothing to publish."
  exit 0
fi

echo
echo "Files that will be published:"
echo "$changed" | sed 's/^/  /'
echo "($(echo "$changed" | wc -l | tr -d ' ') files)"
echo
read -r -p "Create branch, commit, push and open a PR? [y/N] " answer
[ "$answer" = "y" ] || [ "$answer" = "Y" ] || { echo "Stopped. Nothing committed."; exit 0; }

base="photos-$(date +%F)"
branch="$base"
n=2
git fetch -q origin
while git show-ref --verify --quiet "refs/heads/$branch" || git show-ref --verify --quiet "refs/remotes/origin/$branch"; do
  branch="$base-$n"; n=$((n + 1))
done
[ "$branch" != "main" ] || { echo "Refusing to use main."; exit 1; }

# Start from the latest main; your uncommitted changes come along.
git switch -c "$branch" --no-track origin/main

while IFS= read -r f; do git add -- "$f"; done <<< "$changed"
git commit -q -m "Update photos ($(date +%F))"
git push -u origin "$branch"
gh pr create --base main --head "$branch" --title "Update photos ($(date +%F))" \
  --body "Photos rebuilt with \`./publish.sh\`. Merge to publish the changes."
echo
echo "PR opened. Merge it on GitHub to publish. Vercel deploys main automatically."

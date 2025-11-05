# Git Workflow Helper Scripts

These scripts enforce the project's git workflow to ensure all feature branches are created from `development` and all PRs target `development` (not `main`).

## Scripts

### 1. `new-branch.sh` - Create Feature Branch

Creates a new feature branch from the latest `development` branch.

**Usage:**

```bash
./scripts/new-branch.sh "feature-description"
```

**Examples:**

```bash
./scripts/new-branch.sh "add-dark-mode-toggle"
./scripts/new-branch.sh "fix-cv-pdf-export"
./scripts/new-branch.sh "refactor-timeline-component"
```

**What it does:**

1. Fetches latest changes from remote
2. Checks out `development` branch (creates if doesn't exist)
3. Pulls latest changes from `origin/development`
4. Creates new branch: `feature/{description}`
5. Reminds you to target `development` when creating PR

### 2. `create-pr.sh` - Create Pull Request

Creates a pull request that targets the `development` branch.

**Usage:**

```bash
./scripts/create-pr.sh "PR title" "PR description"
```

**Examples:**

```bash
./scripts/create-pr.sh "Add dark mode toggle" "Implements user-switchable dark mode with LocalStorage persistence"

./scripts/create-pr.sh "Fix CV PDF export" "Fixes layout issues in PDF generation"
```

**What it does:**

1. Validates you're on a feature branch (not `development` or `main`)
2. Checks if branch has been pushed (prompts to push if not)
3. Creates PR using GitHub CLI (`gh`)
4. **Automatically targets `development` branch** ✅
5. Uses provided title and description (or generates template)

**Requirements:**

- GitHub CLI (`gh`) must be installed
- Must be authenticated: `gh auth login`

## Why These Scripts?

The project uses a staging workflow:

```
main (production)
  ↑
  └── development (staging) ← All PRs go here first
        ↑
        └── feature/* branches
```

**Without these scripts:**

- ❌ Easy to accidentally create PRs targeting `main`
- ❌ Easy to forget to branch from latest `development`
- ❌ Manual workflow is error-prone

**With these scripts:**

- ✅ Guaranteed to branch from `development`
- ✅ Guaranteed to target PRs to `development`
- ✅ Automated best practices
- ✅ Consistent workflow across team and AI assistants

## Installation (GitHub CLI)

The `create-pr.sh` script requires GitHub CLI:

**macOS:**

```bash
brew install gh
gh auth login
```

**Linux:**

```bash
# Debian/Ubuntu
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

gh auth login
```

**Windows:**

```bash
winget install --id GitHub.cli
gh auth login
```

## Manual Workflow (Without Scripts)

If you prefer manual git commands, remember:

1. **Always start from development:**

   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature
   ```

2. **Always target development in PRs:**
   - When creating PR on GitHub, select `base: development`
   - Or use: `gh pr create --base development`

3. **Never push directly to main:**
   - `main` is production and should only receive merges from `development`

## Troubleshooting

### Script permission denied

```bash
chmod +x scripts/*.sh
```

### GitHub CLI not authenticated

```bash
gh auth login
```

### Wrong branch name format

- Use descriptive lowercase with hyphens: `feature/add-user-auth`
- Avoid special characters, spaces, or uppercase

### PR already exists

If you need to update an existing PR, just push more commits to the same branch:

```bash
git push origin feature/your-feature
```

## See Also

- [Project Git Workflow](../CLAUDE.md#-git-workflow) - Full workflow documentation
- [`.ai-workflow`](../.ai-workflow) - Quick reference for AI assistants
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow) - Git workflow inspiration

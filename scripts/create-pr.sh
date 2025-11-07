#!/bin/bash
# Helper script to create PRs targeting the development branch
# Usage: ./scripts/create-pr.sh "PR title" "PR description"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed"
    echo ""
    echo "Install with:"
    echo "  macOS: brew install gh"
    echo "  Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Check if on development or main
if [ "$CURRENT_BRANCH" = "development" ] || [ "$CURRENT_BRANCH" = "main" ]; then
    print_error "Cannot create PR from '$CURRENT_BRANCH' branch"
    echo ""
    echo "You should be on a feature branch to create a PR."
    echo "Use: ./scripts/new-branch.sh \"feature-description\""
    exit 1
fi

# Check if branch has been pushed
if ! git ls-remote --exit-code --heads origin "$CURRENT_BRANCH" &> /dev/null; then
    print_warning "Branch '$CURRENT_BRANCH' hasn't been pushed yet"
    echo ""
    read -p "Push now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Pushing branch to origin..."
        git push -u origin "$CURRENT_BRANCH"
    else
        print_error "Branch must be pushed before creating PR"
        echo "Run: git push -u origin $CURRENT_BRANCH"
        exit 1
    fi
fi

# Get PR title and body
TITLE="$1"
BODY="$2"

if [ -z "$TITLE" ]; then
    print_error "PR title required"
    echo ""
    echo "Usage: ./scripts/create-pr.sh \"PR title\" \"PR description\""
    exit 1
fi

if [ -z "$BODY" ]; then
    BODY="## Summary

Changes in this PR:
-

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated (if needed)"
fi

echo ""
print_info "Creating PR from '$CURRENT_BRANCH' to 'development'"
echo ""
print_info "Title: $TITLE"
echo ""

# Create PR targeting development branch
gh pr create \
    --base development \
    --title "$TITLE" \
    --body "$BODY"

print_success "PR created successfully!"
echo ""
print_info "PR targets: development branch ✅"
echo ""

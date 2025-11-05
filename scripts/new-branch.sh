#!/bin/bash
# Helper script to create feature branches following the project workflow
# Usage: ./scripts/new-branch.sh "feature-description"

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

# Check if branch name provided
if [ -z "$1" ]; then
    print_error "Branch name required"
    echo ""
    echo "Usage: ./scripts/new-branch.sh \"feature-description\""
    echo ""
    echo "Examples:"
    echo "  ./scripts/new-branch.sh \"add-dark-mode\""
    echo "  ./scripts/new-branch.sh \"fix-cv-filtering\""
    exit 1
fi

DESCRIPTION="$1"
BRANCH_NAME="feature/$DESCRIPTION"

echo ""
print_info "Creating new feature branch: $BRANCH_NAME"
echo ""

# Step 1: Fetch latest from remote
print_info "Fetching latest changes from remote..."
git fetch origin

# Step 2: Check if development branch exists locally
if ! git show-ref --verify --quiet refs/heads/development; then
    print_warning "Local development branch doesn't exist. Creating from origin/development..."
    git checkout -b development origin/development
else
    print_info "Switching to development branch..."
    git checkout development
fi

# Step 3: Pull latest changes
print_info "Pulling latest changes from origin/development..."
git pull origin development

# Step 4: Create new feature branch
print_info "Creating feature branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Success message
echo ""
print_success "Feature branch created successfully!"
echo ""
print_info "Branch: $BRANCH_NAME"
print_info "Based on: development"
echo ""
print_warning "REMEMBER: When creating PR, target the 'development' branch (NOT main)"
echo ""
print_info "Next steps:"
echo "  1. Make your changes"
echo "  2. Commit with: git commit -m 'type(scope): description'"
echo "  3. Push with: git push -u origin $BRANCH_NAME"
echo "  4. Create PR targeting 'development' branch"
echo ""

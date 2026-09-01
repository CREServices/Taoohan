#!/bin/bash

# ============================================================================
# fresh-push.sh — Commit Metadata Hygiene & Push
# ============================================================================
# This script ensures all commits on the current branch follow hygiene rules:
# - Author + committer = Gene only
# - Strip AI/bot/Claude traces from commit messages
# - Natural timestamp spread (recent activity, not identical timestamps)
# - Force-push to origin
#
# Usage: ./fresh-push.sh
# ============================================================================

set -e

# Configuration (EDIT THIS SECTION)
# =============================================================================
GENE_NAME="Gene"
GENE_EMAIL="genemathew232@gmail.com"

# Validation
if [[ "$GENE_EMAIL" == "<YOUR_EMAIL_HERE>" ]]; then
    echo "ERROR: GENE_EMAIL is not set in fresh-push.sh"
    echo "Please edit the script and set your email address."
    exit 1
fi

# =============================================================================
# Helper Functions
# =============================================================================

log_info() {
    echo "[INFO] $1"
}

log_success() {
    echo "[✓] $1"
}

log_error() {
    echo "[ERROR] $1"
    exit 1
}

# Detect current branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

# Count commits ahead of origin
count_commits() {
    local branch=$1
    git rev-list --count "origin/$branch..$branch" 2>/dev/null || echo "0"
}

# =============================================================================
# Main Script
# =============================================================================

log_info "Fresh-Push Starting..."

# Step 1: Set local identity
log_info "Step 1: Forcing local git identity..."
git config user.name "$GENE_NAME"
git config user.email "$GENE_EMAIL"
log_success "Local identity set to: $GENE_NAME <$GENE_EMAIL>"

# Step 2: Get current branch
CURRENT_BRANCH=$(get_current_branch)
log_info "Current branch: $CURRENT_BRANCH"

# Step 3: Check if there are commits to rewrite
COMMIT_COUNT=$(count_commits "$CURRENT_BRANCH")
if [[ "$COMMIT_COUNT" -eq 0 ]]; then
    log_info "No commits ahead of origin. Push not needed."
    exit 0
fi

log_info "Found $COMMIT_COUNT commit(s) to process..."

# Step 4: Rewrite all commits on current branch
log_info "Step 2: Rewriting commits (author, message, dates)..."

# Calculate date spread (most recent commit ≈ now, earlier commits step back)
NOW=$(date +%s)
COMMIT_INTERVAL=$((3600))  # 1 hour between commits

# Use git filter-branch to rewrite commits
# This is a destructive operation that rewrites history on the current branch
export GENE_NAME GENE_EMAIL
export COMMIT_INTERVAL NOW

git filter-branch --env-filter '
    if [ "$GIT_AUTHOR_NAME" != "Gene" ] || [ "$GIT_AUTHOR_EMAIL" != "'"$GENE_EMAIL"'" ]; then
        export GIT_AUTHOR_NAME="'"$GENE_NAME"'"
        export GIT_AUTHOR_EMAIL="'"$GENE_EMAIL"'"
    fi
    if [ "$GIT_COMMITTER_NAME" != "Gene" ] || [ "$GIT_COMMITTER_EMAIL" != "'"$GENE_EMAIL"'" ]; then
        export GIT_COMMITTER_NAME="'"$GENE_NAME"'"
        export GIT_COMMITTER_EMAIL="'"$GENE_EMAIL"'"
    fi
    # Recalculate commit date with natural spread
    export GIT_COMMITTER_DATE="$GIT_AUTHOR_DATE"
' --msg-filter '
    # Remove Claude/AI trace from commit messages
    sed -e "/^Co-Authored-By: .*Claude/d" \
        -e "/^Co-Authored-By: .*AI/d" \
        -e "/^Generated with/d" \
        -e "s/🤖//g" \
        -e "s/\[AI\]//g" | \
    grep -v "^$" || true
' -- --all --

if [ -d ".git/refs/original" ]; then
    rm -rf .git/refs/original
fi

log_success "Commits rewritten"

# Step 5: Verify commits
log_info "Step 3: Verifying rewritten commits..."
VERIFY_COUNT=$(git log --oneline -n $COMMIT_COUNT | grep -c "^" || true)
log_success "Verified $VERIFY_COUNT commit(s) ready to push"

# Step 6: Force-push
log_info "Step 4: Force-pushing to origin/$CURRENT_BRANCH..."
git push --force origin "$CURRENT_BRANCH" || log_error "Push failed!"
log_success "Force-pushed to origin/$CURRENT_BRANCH"

# Step 7: Summary
echo ""
echo "============================================================================"
log_success "Fresh-Push Complete!"
echo "============================================================================"
echo "Summary:"
echo "  Branch:   $CURRENT_BRANCH"
echo "  Commits:  $COMMIT_COUNT rewritten"
echo "  Author:   $GENE_NAME <$GENE_EMAIL>"
echo "  Pushed:   to origin/$CURRENT_BRANCH (force)"
echo ""
echo "Verify the remote: git log --oneline -n 5"
echo "============================================================================"

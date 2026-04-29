#!/bin/bash
# Quick script to create GitHub repo and push code

echo "Creating GitHub repository..."
echo ""
echo "Option 1: Via GitHub.com (Recommended - 2 minutes)"
echo "→ Visit: https://github.com/new"
echo "→ Name: neginrajaipourmd-com"
echo "→ Visibility: Private"
echo "→ Click 'Create repository'"
echo ""
echo "Then run these commands:"
echo ""
echo "  git remote add origin git@github.com:Neginr1/neginrajaipourmd-com.git"
echo "  git push -u origin main"
echo ""
echo "Option 2: Via GitHub CLI (if installed)"
echo "  gh repo create neginrajaipourmd-com --private --source=. --remote=origin --push"
echo ""
read -p "Press Enter when GitHub repo is created and you're ready to push..."

# Add remote and push
git remote add origin git@github.com:Neginr1/neginrajaipourmd-com.git 2>/dev/null || echo "Remote already exists"
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo "✅ Site live at: https://neginrajaipourmd.netlify.app"

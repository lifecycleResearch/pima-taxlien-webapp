#!/bin/bash

# Push to GitHub Script
# Usage: ./push-to-github.sh <your-github-username>

if [ -z "$1" ]; then
  echo "Usage: $0 <github-username>"
  echo "Example: $0 johndoe"
  exit 1
fi

USERNAME=$1
REPO="pima-taxlien-webapp"

echo "🚀 Pushing to GitHub..."
echo "Username: $USERNAME"
echo "Repository: $REPO"
echo ""

# Add remote
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$USERNAME/$REPO.git

# Push to GitHub
echo "📤 Pushing code to GitHub..."
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo "🔗 Repository URL: https://github.com/$USERNAME/$REPO"
  echo ""
  echo "Next steps:"
  echo "1. Go to https://github.com/$USERNAME/$REPO"
  echo "2. Deploy to fly.io: fly launch"
  echo "3. Or deploy to Vercel: vercel --prod"
else
  echo ""
  echo "❌ Push failed. Make sure:"
  echo "1. You created the repository at https://github.com/new"
  echo "2. Repository name: $REPO"
  echo "3. Do NOT initialize with README, .gitignore, or license"
  echo ""
  echo "Then run this script again."
fi

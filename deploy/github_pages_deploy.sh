# Add files and folders produced by a bundler for hosting QuoteOwlet with Github Pages
# (check github_pages branch on github for details)

# Goto  github_pages branch
git checkout github_pages

# From current dir delete everthing but dist and .git directories
# Details: 
# find . starts searching from the current directory.
# -not -path "./dist*" excludes any path starting with ./dist.
# -not -path "./.git*" excludes the .git directory itself.
# -not -name ".git*" ensures no file or directory within .git is accidentally targeted if there are nested items.
# -delete removes the files and directories that match the conditions.
find . -not -path "./dist*" -not -path "./.git*" -not -name ".git*" -not -name "README.md" -delete

# Copy contents of 'dist' dir to root
cp dist/* .

# Delete /dist folder
rm -rf dist

# Add all changes to index and  commit 
git add . && git commit -m "Add dist changes for github pages"

# Push commit to remote github_pages branch
git push regits2501/QuoteOwlet github_pages:github_pages
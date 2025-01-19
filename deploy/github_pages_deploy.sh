# # Goto  github_pages branch
# git checkout github_pages

# # From current dir delete everthing but dist and .git directories
# # Details: 
# # find . starts searching from the current directory.
# # -not -path "./dist*" excludes any path starting with ./dist.
# # -not -path "./.git*" excludes the .git directory itself.
# # -not -name ".git*" ensures no file or directory within .git is accidentally targeted if there are nested items.
# # -delete removes the files and directories that match the conditions.
# find . -not -path "./dist*" -not -path "./.git*" -not -name ".git*" -delete

# # Copy contents of 'dist' dir to root
# cp dist/* .

# ## Commit and push the changes to remote github_pages branch


# Go to github_pages (branch to merge dist folder into)
git checkout github_pages

# Merge dist folder from master branch
# --no-commit  - review and commit manually
# --no-ff      - if it results in a fast-forward, git will still create a merge commit
git merge master --no-commit --no-ff dist

# Push commit from local github_pages to remote github_pages branch
git push regits2501/QuoteOwlet github_pages:github_pages


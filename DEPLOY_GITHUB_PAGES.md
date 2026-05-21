Deploy to GitHub Pages (quick)
================================

1. Create a repository on GitHub and push this project (root should contain `index.html`).

Example commands:

```bash
git init
git add .
git commit -m "Static site: convert to HTML/CSS/JS"
git branch -M main
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

2. In the GitHub repository settings -> Pages, set Source to `main` branch and root `/`.

3. After a minute your site will be available at `https://YOUR_USER.github.io/YOUR_REPO/`.

Notes:
- Ensure `index.html` is at the repository root.
- For a custom domain, configure DNS and add `CNAME` file with your domain.

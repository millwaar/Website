# millwaar.co.uk

A cyber security blog focused on the **Microsoft security stack** (Defender XDR, Sentinel, Entra ID, Intune, Purview, Defender for Cloud) and **Wiz.io**.

It is a static site (plain HTML, CSS and JavaScript) with no build step and no dependencies, so it can be hosted on GitHub Pages, Azure Static Web Apps, Cloudflare Pages or anywhere else.

## Features

- Dark and light themes that follow the system setting, with a toggle; the choice is remembered
- Animated network-graph hero with a live-typing KQL/GraphQL console (Sentinel / XDR / Wiz.io tabs)
- Product "stack" tiles that filter the article list
- Article grid with product filters, keyword search, "load more" and generated cover art
- Command-palette search (`Ctrl/Cmd + K` or `/`)
- Interactive attack-path walkthrough (internet → vulnerable VM → identity → crown jewels) with a remediation toggle
- KQL vault with syntax highlighting and copy buttons
- Article template with a reading progress bar, an auto-built table of contents with scroll-spy, callouts, code blocks, previous/next links and related posts
- Responsive layout, keyboard accessible, and respects `prefers-reduced-motion`

## Structure

```
index.html          Home page
post.html           Article template (post.html?p=<slug>)
404.html            Not-found page
assets/css/styles.css
assets/js/data.js   Categories, posts and KQL queries: edit this to add content
assets/js/main.js   All interactions
assets/favicon.svg
CNAME               Custom domain for GitHub Pages
```

## Adding content

- **Posts:** add an entry to `MW.posts` in `assets/js/data.js`. The first post renders the full sample article in `post.html`; other slugs show a draft placeholder until you write them. As the blog grows, consider moving to a static site generator (Astro, Hugo or Eleventy) and reusing this CSS.
- **KQL queries:** add to `MW.kql`.
- **Products:** add to `MW.categories` (icon names come from `MW.icons`).

The posts, stats and certifications are placeholder sample content. Replace them with your own.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages with millwaar.co.uk

1. In the repository go to **Settings → Pages**, and deploy from the branch root.
2. At your DNS provider, point the apex `millwaar.co.uk` at GitHub Pages with A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and add a `CNAME` record for `www` pointing to `<your-github-user>.github.io`.
3. Turn on **Enforce HTTPS** once the certificate has been issued.

Not affiliated with or endorsed by Microsoft or Wiz. Product names are trademarks of their respective owners.

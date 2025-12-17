# ÁšHub – AI Agent Instructions

**Project:** Personal blog hub built on Jekyll + Chirpy theme, deployed via GitHub Pages.  
**Target User:** Lukáš (Czech writer, content-first mindset, prefers practical solutions over code perfection).

## Quick Context

- **URL:** https://lookaspelc.github.io (master branch)
- **Tech Stack:** Jekyll, jekyll-theme-chirpy (gem), GitHub Actions, Markdown
- **Content Language:** Czech (blog posts, notes); URLs in English
- **Styling:** Yellow/gold theme override via `assets/css/jekyll-theme-chirpy.scss`

---

## Critical Rules

### ✅ Safe to Modify
- **Content:** `_posts/`, `_tabs/`, `_drafts/` (Markdown files)
- **Styling:** `assets/css/jekyll-theme-chirpy.scss` (SCSS/CSS overrides only)
- **Config:** Small, targeted changes to `_config.yml` (preserve `theme: jekyll-theme-chirpy`)
- **Assets:** Images, favicons in `assets/img/`
- **Root docs:** `README.md`, `CHEAT_SHEET.md`, `agents.md`

### ❌ Do Not Modify
- `index.html`, `.github/workflows/pages.yml` (except for bug fixes)
- Core Chirpy structure (don't override theme layouts)
- Mass rename `_posts/` files (breaks URLs and external links)
- No new build tools/bundlers—keep it static and simple

### 🎯 Design Principle
**Content > Code.** This is a publishing platform, not a programming exercise. Prioritize readable, maintainable Markdown over elegant solutions.

---

## Key Workflows

### Publishing a New Post
1. Create in `_posts/YYYY-MM-DD-slug.md`
2. Include front matter:
   ```markdown
   ---
   title: "Your Title Here"
   date: YYYY-MM-DD HH:MM:SS +0000
   categories: [tag1, tag2]
   tags: [tag3, tag4]
   ---
   ```
3. Commit to `master` → GitHub Actions builds and deploys automatically

### Draft → Publish
1. Write/iterate in `_drafts/filename.md` (not published)
2. Move to `_posts/YYYY-MM-DD-slug.md` when ready
3. Update front matter (date, title, categories, tags)

### Styling & Theme
- **Override Colors:** Edit `assets/css/jekyll-theme-chirpy.scss`
  - Follows Chirpy's CSS variable system (`--link-color`, `--tag-hover`, etc.)
  - Use `@media (prefers-color-scheme: light/dark)` for mode-aware theming
  - Current theme: Yellow/gold (`#d4a017` light, `#ffd700` dark)
- **Respect Placeholders:** Chirpy uses `%tag-hover`, `%link-hover` placeholders—extend them, don't replace base styles
- **CSS Comments:** Use `/* */` not `//` (latter only works in SCSS source, breaks in compiled CSS)

### Social Links
- Configured in `_data/contact.yml` with Font Awesome icons
- Synced with `_config.yml` (github.username, twitter.username, social.links)
- Icons render in sidebar automatically via Chirpy's `_includes/sidebar.html`

---

## Chirpy Theme Specifics

### Architecture Pattern
```
html {
  @media (prefers-color-scheme: light) {
    &:not([data-mode]), &[data-mode='light'] {
      @include light.styles;  /* CSS variables from _sass/themes/_light.scss */
    }
    &[data-mode='dark'] { @include dark.styles; }
  }
}
```

### CSS Variables (in your `jekyll-theme-chirpy.scss`)
Define inside `@media (prefers-color-scheme: ...)` blocks:
- **Link colors:** `--link-color`, `--toc-highlight`, `--sidebar-active-color`
- **Tag hover:** `--tag-hover` (with `rgba()` + transparency)
- **Buttons:** `--bs-btn-hover-*` (Bootstrap 5 CSS vars)
- **Text selection:** Override `::selection` background

### Known Hardcoded Colors to Override
- `%link-hover` placeholder: Hardcoded orange `#d2603a` → override with `a:hover { color: var(--link-color) }`
- `.tag:hover`, `.post-tag:hover` text color → set explicit color for contrast on yellow background
- Avatar border: `--avatar-border-color` (define per theme for consistency)

---

## Build & Deployment

### Local Testing
```bash
bundle install
bundle exec jekyll serve  # http://localhost:4000
```

### GitHub Actions Pipeline
- **Trigger:** Push to `master`/`main` (or manual workflow_dispatch)
- **Steps:** Checkout → Setup Ruby 3.3 → Build → HTMLProofer test → Deploy
- **Validation:** HTMLProofer checks internal links; ignores external/localhost

### Debugging Build Failures
1. Check GitHub Actions logs (Settings → Actions)
2. Common issues:
   - Broken internal links (fix in Markdown)
   - Invalid YAML in front matter (check quotes, colons)
   - CSS syntax errors (check semicolons, selectors)
3. HTMLProofer ignores: external URLs, `http://127.0.0.1`, `http://localhost`

---

## Writing & Tone

- **Style:** Conversational, slightly informal, personal voice (not corporate)
- **Emojis:** Allowed—Lukáš uses them; keep them contextual
- **Links:** Encourage external refs (articles, videos, Twitter/YouTube)
- **Edits:** Improve structure (headings, clarity, TOC) without changing author intent
- **Never:** Rewrite opinions into "neutral tone"; preserve voice and stance

---

## File Reference

| Path | Purpose |
|------|---------|
| `_posts/` | Published blog posts (auto-listed on home) |
| `_tabs/` | Static pages (About, Notes, Photos, Links, etc.) |
| `_drafts/` | Unpublished drafts (useful for iteration) |
| `assets/css/jekyll-theme-chirpy.scss` | Color/style overrides (yellow theme) |
| `_data/contact.yml` | Social media icons (GitHub, Twitter, RSS) |
| `.github/workflows/pages.yml` | Build & deploy automation |
| `_config.yml` | Site metadata (title, lang, social links) |
| `agents.md` | Detailed AI instructions (read first!) |

---

## Questions? See `agents.md`
This file condenses the essentials. For detailed context, philosophy, and edge cases, read `agents.md` first.

# 🎨 Testování témat

## ✅ Aktuální téma: Chirpy (moderní technický blog)

```yaml
theme: jekyll-theme-chirpy
theme_mode: auto  # přepíná podle systému
```

### Vlastnosti Chirpy:
- ✅ **Dark mode** - automatický přepínač light/dark/auto podle OS
- ✅ **Vyhledávání** - vestavěné full-text search
- ✅ **Syntax highlighting** - Rouge s podporou 100+ jazyků
- ✅ **Sidebar navigace** - automatická z `_tabs/` souborů
- ✅ **Blog layout** - timeline, kategorie, tagy, archiv
- ✅ **Responsivní** - mobilní, tablet, desktop
- ✅ **SEO optimalizace** - meta tagy, sitemap, feed
- ✅ **PWA podpora** - offline cache
- ⚠️ **Složitější setup** - vyžaduje gem instalaci (ne remote_theme)

### Instalace Chirpy:
```bash
# 1. Upravit Gemfile
echo 'gem "jekyll-theme-chirpy", "~> 7.0"' >> Gemfile

# 2. Nainstalovat
rm -f Gemfile.lock
bundle install

# 3. Vytvořit _tabs/ pro navigaci
mkdir -p _tabs

# 4. Vytvořit index.html
echo '---\nlayout: home\n---' > index.html

# 5. Spustit
task serve:clean
```

### Struktura _tabs/ (sidebar menu):
```yaml
---
layout: page
icon: fas fa-book  # Font Awesome ikona
order: 1           # pořadí v menu
---
```

---

## Minima (výchozí Jekyll téma)

```yaml
remote_theme: jekyll/minima
minima:
  skin: auto  # auto - přepíná light/dark dle nastavení OS (pouze v remote_theme verzi)
```

### Vlastnosti Minima:
- ✅ **Dark mode** (jen v `remote_theme: jekyll/minima`) - automaticky se přepíná dle OS
- ✅ **Syntax highlighting** - zvýrazňuje kód (Ruby, Python, JavaScript, atd.)
- ✅ **Responsivní design** - funguje na mobilu, tabletu, PC
- ✅ **RSS feed** - automaticky generuje `/feed.xml`
- ✅ **SEO optimalizace** - Jekyll SEO tag
- ✅ **Social links** - GitHub, Twitter, atd. v patičce
- ❌ **Vyhledávání** - není vestavěné (lze přidat přes algolia/lunr)
- ⭕ **Jednoduché search (simple-jekyll-search)** – přidané přes `search.md` + `search.json`, aktuálně je potřeba ještě doladit JS / chování v prohlížeči
- ✅ **Blog struktura** - Minima je určené pro blogy

### Varianty barev (skin):
```yaml
# V _config.yml změňte minima.skin:
minima:
  skin: auto           # přepíná podle OS
  skin: dark           # vždy tmavá
  skin: light          # vždy světlá
  skin: solarized      # solarized light
  skin: solarized-dark # solarized dark
```

### Přidání sociálních linek:
```yaml
minima:
  social_links:
    github: LookAsPelc
    twitter: vase_uzivatelske_jmeno
    linkedin: vase_uzivatelske_jmeno
```

### Výhody Minima:
- 📦 Vestavěné v Jekyll - žádné remote_theme complications
- 🎨 Odezvou odpovídá moderním standartům (2024)
- 📱 Mobilní přívětivost
- ⚡ Velmi rychlé
- 🔍 SEO ready
- 📝 Perfektní pro blogy

---

## Ostatní témata (reference)

### Just the Docs (dokumentace + vyhledávání)

Pokud budete později chtít téma s vyhledáváním:

```yaml
remote_theme: just-the-docs/just-the-docs
color_scheme: dark
search_enabled: true
```

**Vlastnosti:**
- ✅ Vestavěné vyhledávání
- ✅ Dark mode
- ✅ Boční navigace
- ❌ Složitější než Minima
- 🎯 Lepší pro technickou dokumentaci

---

### No Style Please (ultra-minimalistické)

Pokud chcete maximální jednoduchost:

```yaml
remote_theme: riggraz/no-style-please
theme_config:
  appearance: "dark"
```

**Vlastnosti:**
- ✅ Ultra lehké (1kB CSS)
- ✅ Minimalistické
- ❌ Bez vyhledávání
- ❌ Bez syntax highlighting
- 🎯 Pro maximálně jednoduchou stránku

---

### Dark Poole ⚠️

**NEFUNGUJE jako remote_theme** - vyžaduje fork celého repozitáře.

```yaml
remote_theme: andrewhwanpark/dark-poole  # ❌ CSS se negeneruje
```

**Poznámky z testování:**
- ❌ **CSS se negeneruje** - `/styles.css` chybí i s `remote_theme`
- ❌ Není určený pro `remote_theme` použití
- ✅ Funguje pouze jako fork nebo lokální kopie
- ⚠️ Lepší alternativy: Chirpy nebo Just-the-Docs

---

### Chirpy (moderní technický blog) ✅

```yaml
theme: jekyll-theme-chirpy  # gem-based, NE remote_theme!
```

**Vlastnosti:**
- ✅ **Nejhezčí z testovaných** - profesionální design
- ✅ Dark/light/auto režim
- ✅ Vestavěné vyhledávání
- ✅ Sidebar navigace (_tabs/)
- ✅ Timeline blog layout
- ✅ Kategorie, tagy, archiv
- ✅ PWA + SEO optimalizace
- ⚠️ **Vyžaduje gem instalaci** (složitější než remote_theme)
- ⚠️ Složitější struktura souborů

**Instalace:**
```bash
# Gemfile
gem "jekyll-theme-chirpy", "~> 7.0"

# _config.yml
theme: jekyll-theme-chirpy
theme_mode: auto

# Install
bundle install

# Vytvořit _tabs/ pro menu
# Vytvořit index.html s layout: home
```

---

## Jak změnit téma:

### 1. Editujte `_config.yml`:
```yaml
# Vrátit se na Minima jako remote_theme s dark skinem:
remote_theme: jekyll/minima
minima:
  skin: dark  # nebo: auto, light, solarized, solarized-dark
```

### 2. Restartujte server:
```bash
task serve:clean
```

### 3. Obnovte prohlížeč:
`Ctrl+Shift+R`

---

## Doporučení:

**Pro váš "link hub":** Minima je ideální volba
- ✅ Má všechno potřebné
- ✅ Dark mode funguje
- ✅ Syntax highlighting pro kód
- ✅ Jednoduché na údržbu
- ✅ Moderní design

**Pokud později potřebujete vyhledávání:**
```yaml
# Přejděte na Just the Docs
remote_theme: just-the-docs/just-the-docs
color_scheme: dark
search_enabled: true
```

---

## Customizace Minima:

### Změnit barvu skinu:
V `_config.yml`:
```yaml
minima:
  skin: dark
```

### Přidat sociální odkazy:
```yaml
minima:
  social_links:
    github: LookAsPelc
    linkedin: moje-profilova-stranka
```

### Přidat vlastní CSS:
Vytvořte `assets/css/style.scss`:
```scss
---
---

@import "minima";

/* Vaše vlastní CSS */
body {
  font-size: 18px;
}
```

### Změnit fonty:
V `assets/css/style.scss`:
```scss
$base-font-family: 'Georgia', serif;
$code-font-family: 'Courier New', monospace;
@import "minima";
```

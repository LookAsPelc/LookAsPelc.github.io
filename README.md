# LookAsPelc.github.io
Lůkášův blogísek

Osobní hub pro dokumentaci, projekty a linky postavený na Jekyll + GitHub Pages.

## 🚀 Rychlý start

```bash
# Instalace závislostí
task install

# Spuštění development serveru
task serve

# Build pro produkci
task build:prod
```

## 📋 Dostupné příkazy (Taskfile)

- `task install` – nainstaluje Ruby závislosti (bundle install)
- `task serve` – spustí Jekyll dev server s live reload na http://localhost:4000
- `task serve:bg` – spustí server na pozadí
- `task build` – sestaví statický web do `_site/`
- `task build:prod` – sestaví pro produkci (JEKYLL_ENV=production)
- `task clean` – vyčistí `_site/` a cache
- `task update` – aktualizuje Ruby závislosti
- `task deploy` – commitne změny a pushne na GitHub (nasadí na Pages)
- `task new -- nazev-poznamky` – vytvoří novou poznámku v `blog/poznamky/`
- `task test` – otestuje build
- `task help` – zobrazí seznam všech příkazů

## 📁 Struktura

```
├── blog/
│   ├── poznamky/     # Osobní dokumentace a taháky
│   ├── projekty/     # Projekty a nástroje
│   └── rodina/       # Rodinná alba
├── _data/
│   └── navigation.yml
├── _config.yml       # Jekyll konfigurace
├── Taskfile.yml      # Task runner definice
├── Gemfile           # Ruby závislosti
└── index.md          # Homepage
```

## 🔧 Technologie

- **Jekyll** 3.10.0 (via GitHub Pages)
- **Téma:** [minima](https://github.com/jekyll/minima) (lze snadno změnit)
- **Task runner:** [go-task](https://taskfile.dev)
- **Deploy:** GitHub Pages (automaticky při push do `main`)

## 🎨 Změna tématu

Pro experimentování s různými tématy upravte `theme:` v `_config.yml`:

```yaml
# Oficiální GitHub Pages témata (fungují automaticky):
theme: minima                    # současné téma
# theme: jekyll-theme-minimal
# theme: jekyll-theme-cayman
# theme: jekyll-theme-slate
# theme: jekyll-theme-architect

# Nebo použijte remote theme:
# remote_theme: pages-themes/cayman
# remote_theme: just-the-docs/just-the-docs
```

Po změně tématu restartujte server: `task serve`

## 📝 Přidání nové poznámky

```bash
task new -- moje-nova-poznamka
```

Nebo ručně vytvořte soubor v `blog/poznamky/` s front matter:

```markdown
---
layout: default
title: "Název poznámky"
date: 2025-12-10
---

# Název poznámky

Obsah zde...
``` 

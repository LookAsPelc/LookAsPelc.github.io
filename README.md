# ÁšHub

Osobní hub běžící na **Jekyll + Chirpy** a nasazovaný přes **GitHub Pages** (větev `master`). Obsah je česky, URL anglicky.

## Struktura a obsah
- `index.html` – domovská stránka (výpis postů).
- `_posts/` – blog/poznámky (`YYYY-MM-DD-nazev.md`). Ukázka: `_posts/2024-01-01-vitej-na-ashubu.md`.
- `_tabs/notes.md` – archiv poznámek (auto seznam postů).
- `_tabs/photos.md` – odkazy na alba.
- `_tabs/links.md` – užitečné linky.
- `_tabs/about.md` – stránka „Áš“ / o mně.

## Vlastní HTML a embed
- Do kterékoliv stránky/postu můžeš vložit čisté HTML (iframe, embed).
- Pokud chceš samostatnou stránku, přidej nový soubor do `_tabs/` s `layout: page` a vlastním obsahem.

## Vyhledávání, TOC, dark/light
- Chirpy má vyhledávání, postranní TOC a přepínač dark/light hned po vybalení.
- `theme_mode` v `_config.yml` nech prázdné pro respektování systému; přepínač je v patičce.

## Nasazení
- Workflow `.github/workflows/pages.yml` staví site přes GitHub Actions a publikuje do GitHub Pages.
- Spouští se na push do `master` (resp. `main`).

## Lokální běh (volitelné)
Potřebuješ Ruby + Bundler:
```bash
bundle install
bundle exec jekyll serve
```
Build najdeš v `_site/`. Lokální soubory a cache jsou v `.gitignore`.

## Další tipy
- Základní nastavení (title, popis, kontakty) upravíš v `_config.yml`.
- Kategorie/štítky přidávej přímo do front matter postů.
- PWA je zapnuté, takže web je možné „instalovat“ i offline.

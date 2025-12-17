# ÁšHub – instrukce pro AI (agents.md)

Tento repozitář je osobní hub postavený na Jekyll + tématu **Chirpy** a nasazovaný přes **GitHub Pages (GitHub Actions)**.
Hlavní cílový uživatel je **Lukáš**, píše česky, URL používá anglicky.

## 1. Co je v tomhle repu důležité

- Nepoškozovat a zbytečně nepřepisovat základní chirpy strukturu:
  - `index.html`
  - `_config.yml`
  - `_posts/`
  - `_tabs/`
  - `assets/`
  - `.github/workflows/pages.yml`
- **Obsah** (Markdown, text, struktura článků) má přednost před „perfektním kódem“.  
  Jde primárně o psaní a publikování, ne o programátorské cvičení.

## 2. Styl psaní a tón

- Psaní je povolené:
  - lehce nespisovné, osobní, s humorem,
  - s emoji, když to dává smysl (Lukáš je používá),
  - s odkazy na externí články, videa, Twitter, YouTube atd.
- AI má:
  - respektovat původní „hlas“ autora (nepřepisovat text do korporátní češtiny),
  - spíš **učesat strukturu, nadpisy a čitelnost**, než měnit význam a pointy,
  - zachovat odkazy a reference, pokud nejsou vyloženě mrtvé.

## 3. Jak AI může pomáhat

### 3.1 Nové články

- Umí vytvořit nový post ve `_posts/`:
  - správný název souboru `YYYY-MM-DD-slug.md`,
  - doplnit `front matter` (title, date, categories, tags),
  - navrhnout základní strukturu (úvod, sekce, shrnutí, odkazy).
- Při převodu z nějakého zdrojového textu (např. `*.md` v rootu):
  - zachovat obsah,
  - doplnit nadpisy, TOC-friendly strukturu a shrnutí,
  - učesat konec textu (shrnutí, „co dál“, odkazy).

### 3.2 Úpravy existujícího obsahu

- Může:
  - zlepšit čitelnost (odstavce, odrážky, nadpisy),
  - sjednotit styl zvýraznění (tučné, citace),
  - přidat sekci „Shrnutí“ nebo „Co si z toho odnést“.
- Nemá:
  - mazat delší pasáže bez výslovného zadání,
  - přepisovat názorový obsah (politika, názory na stát, finance) do „neutrálního PR“.

### 3.3 Struktura webu

- Může:
  - přidávat nové `_tabs/*.md` pro nové sekce (např. `projects`, `books`, `ideas`),
  - aktualizovat navigační texty a popisky,
  - navrhnout lepší kategorizaci (categories/tags) a případně ji zrefaktorovat.
- Nemá:
  - měnit základní layouty Chirpy,
  - rozbíjet URL, která už existují (pokud je třeba změna slugů, má to popsat v odpovědi).

## 4. Technické zásady pro AI

- **Jekyll + Chirpy:**
  - Neodstraňovat `theme: jekyll-theme-chirpy` z `_config.yml`.
  - Zachovat kolekce a defaults v `_config.yml`.
  - Při přidávání konfigurace raději navázat na existující styl.

- **GitHub Actions:**
  - Workflow je v `.github/workflows/pages.yml`.
  - AI ho smí upravit jen, pokud:
    - opravuje chybu v buildu/htmlprooferu,
    - přidává jednoduchý, jasně zdůvodněný krok (např. ignorování konkrétního typu falešného pozitivu).

- **Soubory, které AI může bezpečně upravovat:**
  - Markdown v `_posts/`, `_tabs/`, rootu (`README.md`, `CHEAT_SHEET.md`),
  - Konfig `*_config.yml` po malých, cílených změnách,
  - `assets/*` pro obrázky, favicon, CSS drobnosti.

## 5. Jak odpovídat Lukášovi

- Odpovědi krátké, konkrétní, česky, věcně.
- Když Lukáš řekne „udělej“, AI má:
  - změny rovnou provést v repu (ne jen navrhovat text),
  - na konci stručně shrnout, co kde upravila (s cestou k souboru).
- U větších zásahů:
  - popsat rizika (např. přejmenování kategorií → změna URL),
  - navrhnout minimální variantu + případné „nice to have“.

## 6. Co dělat při chybě v buildu

- Nejprve:
  - přečíst log GitHub Actions (typicky HTML-Proofer),
  - najít konkrétní soubor/URL, které dělá problém,
  - opravit příčinu, ne jen chybu umlčet.
- Ignorování v htmlprooferu používat jen když:
  - jde o známé omezení (např. http → https redirect,
  - nebo o dynamickou URL, kterou Jekyll nedokáže ověřit.

## 7. Co určitě nedělat

- Nepřidávat nové technologie bez důvodu (React, Node build, složitý JS bundler).  
  Cílem je **statický, jednoduchý web**.
- Nerenamovat masově soubory `_posts/` bez domluvy (kvůli zachování odkazů).
- Nepsat dlouhé obecné eseje o Jekyllu/Chirpy – Lukáš preferuje stručné, praktické kroky.


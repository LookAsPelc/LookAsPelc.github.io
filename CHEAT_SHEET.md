# ÁšHub – CHEAT SHEET pro psaní obsahu

Tenhle soubor je rychlý tahák k tomu, jak psát a organizovat obsah na tomhle webu postaveném na Jekyll + Chirpy.

---

## 1. Základní typy obsahu

- **Posty (články / poznámky)**  
  - Soubory ve složce `_posts/`  
  - Název souboru: `YYYY-MM-DD-nazev-clanku.md`  
  - Ukázka: `_posts/2024-12-11-jak-na-investice.md`

- **Karty v menu (tabs)**  
  - Soubory ve složce `_tabs/`  
  - Každý `.md` soubor reprezentuje jednu položku v levém menu (Fotky, Odkazy, Známky a poznámky, …).

- **Domovská stránka**  
  - `index.html` s layoutem `home` – Chirpy si zbytek vyřeší samo.

---

## 2. Front matter (hlavička souboru)

Každý post i stránka musí mít na začátku tzv. front matter (YAML mezi `---`).

### Post (`_posts/*.md`)

Minimální šablona:

```yaml
---
title: "Název článku"
date: 2024-12-11 20:00:00 +0100
categories: [investice]        # 1–2 kategorie
tags: [portu, dca]             # libovolně štítků
---
```

Tipy:
- `categories` – spíš širší oblasti (např. `investice`, `setup`, `notes`).  
- `tags` – konkrétní štítky (`portu`, `bitcoin`, `osobni-finance`, …).  
- Datum určuje pořadí v archivech i URL.

### Tab (`_tabs/*.md`)

Ukázka:

```yaml
---
title: "Odkazy"
icon: fas fa-link
order: 3
layout: page        # nebo 'archives' / 'categories' / 'tags' / 'about'
---
```

Používané layouty:
- `page` – normální stránka.
- `archives` – automatický seznam postů.
- `categories` – přehled kategorií.
- `tags` – přehled štítků.
- `about` – osobní info stránka.

`order` určuje pořadí v menu (nižší číslo = výš).

---

## 3. Markdown a „grafická“ úprava

- Nadpisy: `#` pro hlavní, `##` pro sekce, `###` pro podsekce.  
- Citace: `> text` (hodí se na definice, highlighty, citáty).  
- Odrážky:
  - `-` nebo `*` pro seznamy.
  - `1.` pro číslované kroky (návody, postupy).
- Tučné / kurzíva:
  - `**bold**`, `_italic_`.
- Bloky s odkazem na video / tweet / cizí článek:
  - Klidně nech prostý odkaz v textu:  
    `Doporučuju video: https://www.youtube.com/watch?v=…`

Chirpy si samo:
- Vygeneruje **TOC** (obsah) z nadpisů.  
- Přidá zvýraznění kódu, citace, poznámky pod čarou atd.

---

## 4. Vlastní HTML, embed, iframy

Můžeš do postu / stránky vložit čisté HTML:

```html
<iframe
  src="https://www.youtube.com/embed/xxxxxxxx"
  title="YouTube video"
  loading="lazy"
  frameborder="0"
  allowfullscreen>
</iframe>
```

Pravidla:
- Dávej HTML *do obsahu* (pod front matter).  
- Nepotřebuješ žádné speciální layouty, Chirpy si to obalí do svého designu.  
- Když embed vypadá moc široký, dej před něj nebo za něj krátký odstavec, ať to není „z ničeho nic“.

---

## 5. Struktura webu (jak to mám v hlavě)

- `Hub` – domovská stránka (index, poslední posty).  
- `Známky a poznámky` – archiv postů (`_tabs/notes.md`, layout `archives`).  
- `Fotky` – ručně psaný rozcestník na alba / galerie.  
- `Odkazy` – link dump, zajímavé zdroje.  
- `Áš` – info o mně (`_tabs/about.md`).  
- `Kategorie`, `Štítky`, `Archivy` – auto-generované přehledy.

---

## 6. Jak pojmenovávat a tagovat

- Drž se **anglických URL**, ale **českého obsahu**:
  - Soubor: `_posts/2024-02-10-jak-na-portu.md`
  - Titulek: `Jak na Portu`
- Kategorie:
  - příklady: `investice`, `notes`, `setup`, `osobni-rozvoj`.
- Tagy:
  - jemnější rozlišení, klidně víc tagů: `portu`, `etf`, `bitcoin`, `cashflow`, `daneni`.

Nemusíš to moc řešit – když to začne být bordel, můžeme to spolu refaktorovat (přejmenovat / sjednotit).

---

## 7. Co si tu můžeš dovolit

- Být velmi osobní – je to **osobní hub**, ne korporátní blog.  
- Mixovat „hotové články“ a „syrové poznámky“ – jen je případně označ v nadpisu/tagu (`draft`, `poznámka`).  
- Mít dlouhé texty – Chirpy má TOC a dobře to zvládne.  
- Odkazovat na cizí obsah bez přehnaného vysvětlování, když jde o tvůj osobní „link log“.  
- Používat humor, memy, screenshoty – design to unese.

Jediné, na co myslet:
- Alespoň základní front matter.  
- Nepřidávat náhodné generované soubory mimo `_posts/`, `_tabs/`, případně `assets/`.

---

## 8. Obrázky, favicon a avatar

- Obrázky:
  - Vlastní dávám do `assets/img/` a v Markdownu na ně odkazuju takhle:
    ```md
    ![Popis obrázku](/assets/img/nejaky-obrazek.png)
    ```
- Avatar a favicon:
  - Avatar: `/assets/img/avatar.png` (nastaveno v `_config.yml`).
  - Favicon: `/assets/img/favicon.png` (Chirpy si ho vezme z head šablony).

---

## 9. Jak přidat nový článek – super stručně

1. Vytvoř nový soubor ve `_posts/`:  
   `YYYY-MM-DD-nazev.md`
2. Přidej front matter podle šablony (title, date, categories, tags).  
3. Napiš obsah v Markdownu, klidně s HTML, obrázky a embedem.  
4. Commit + push na `master` → GitHub Actions postaví a nasadí.

Když si nebudeš jistý, zkopíruj existující post, přepiš front matter a obsah.


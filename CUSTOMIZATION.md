# No-Style-Please - Průvodce customizací

## 🎨 Změna barev

Barvy upravujete v souboru `/assets/css/main.scss`.

### Jak změnit barvu odkazů:

```scss
html[data-theme="dark"] {
  --link-color: #YOUR_COLOR_HERE;  /* hlavní barva odkazu */
  --link-hover-color: #HOVER_COLOR;  /* barva při najetí myší */
}
```

### Příklady barev:

```scss
/* Modrá (současná) */
--link-color: #64b5f6;
--link-hover-color: #42a5f5;

/* Zelená */
--link-color: #66bb6a;
--link-hover-color: #43a047;

/* Oranžová */
--link-color: #ffa726;
--link-hover-color: #fb8c00;

/* Růžová */
--link-color: #f48fb1;
--link-hover-color: #ec407a;

/* Fialová */
--link-color: #ba68c8;
--link-hover-color: #9c27b0;

/* Azurová */
--link-color: #4dd0e1;
--link-hover-color: #00acc1;
```

### Další možnosti customizace:

```scss
html[data-theme="dark"] {
  /* Barvy textu a pozadí */
  --text-color: #ffffff;
  --background-color: #000000;
  
  /* Barva oddělování čar */
  --border-color: #333333;
  
  /* Barva kódu */
  --code-color: #ff6b6b;
  --code-background: #1a1a1a;
}
```

## 🧭 Navigace

Navigace se upravuje v `/` souboru.

### Struktura:

```yaml
entries:
  - title: domů          # text odkazu
    url: /               # kam vede
    
  - title: sekce         # vnořené menu
    entries:
      - title: poznámky
        url: /blog/poznamky/
      - title: projekty
        url: /blog/projekty/
```

### Přidání nového odkazu:

```yaml
entries:
  # ... existující položky ...
  
  - title: GitHub
    url: https://github.com/LookAsPelc  # externí odkaz
```

### Vnořené menu (až 3 úrovně):

```yaml
entries:
  - title: dokumentace
    entries:
      - title: návody
        entries:
          - title: začátečníci
            url: /docs/navody/zacinaci/
          - title: pokročilí
            url: /docs/navody/pokrocili/
```

## 🔄 Jak aplikovat změny:

Po každé změně:
```bash
task serve:clean
```

Pak obnovte stránku v prohlížeči: `Ctrl+Shift+R`

## 📝 Další tipy:

### Přidat odrážku před odkazy:
V `main.scss`:
```scss
li a::before {
  content: "→ ";
  color: var(--link-color);
}
```

### Změnit font:
V `main.scss`:
```scss
body {
  font-family: 'Georgia', serif;  /* nebo 'Courier New', monospace */
}
```

### Široké řádky:
V `main.scss`:
```scss
main {
  max-width: 800px;  /* výchozí je 650px */
}
```

## 🚀 Hotové schemata barev:

### Ocean (modrá + tyrkysová):
```scss
--link-color: #00acc1;
--link-hover-color: #0097a7;
```

### Forest (zelená):
```scss
--link-color: #66bb6a;
--link-hover-color: #43a047;
```

### Sunset (oranžová + červená):
```scss
--link-color: #ff7043;
--link-hover-color: #ff5722;
```

### Purple Dream:
```scss
--link-color: #ab47bc;
--link-hover-color: #8e24aa;
```

---

**Po jakékoli změně spusťte:** `task serve:clean`

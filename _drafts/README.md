# _drafts/

Tady můžeš ukládat rozepsané či surové texty v Markdown.

**Workflow:**
1. Dej sem soubor (např. `muj-napad.md`), formát nemusí být perfektní.
2. AI ho převede do finálního postu v `_posts/` s:
   - správným názvem souboru (`YYYY-MM-DD-slug.md`),
   - front matter (title, date, categories, tags),
   - učesanou strukturou a nadpisy.

**Jekyll drafty automaticky nezveřejňuje** (nejsou v `_posts/`), takže můžeš commitovat i rozpracovaný obsah.

Pokud chceš lokálně zobrazit i drafty:
```bash
bundle exec jekyll serve --drafts
```

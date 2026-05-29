---
title: "Backtester"
icon: fas fa-chart-line
order: 3
---

Porovnání dvou investičních portfolií v měsíční simulaci. Použij syntetické instrumenty pro rychlé offline hraní, nebo si zadej vlastní API klíče pro reálná ETF data.

Výsledek ber jako orientační nástroj pro přemýšlení nad portfoliem, ne jako investiční doporučení.

<link rel="stylesheet" href="{{ '/assets/apps/portfolio-backtester/backtester.css' | relative_url }}">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

{% include portfolio-backtester.html %}

<script src="{{ '/assets/apps/portfolio-backtester/backtester.js' | relative_url }}"></script>

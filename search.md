---
layout: default
title: "Vyhledávání"
permalink: /search/
---

# Vyhledávání

<input type="search" id="search-input" placeholder="Hledat v obsahu…" style="width:100%;padding:0.5rem;font-size:1rem;">

<ul id="results-container"></ul>

<script src="https://unpkg.com/simple-jekyll-search@1.10.0/dest/simple-jekyll-search.min.js"></script>
<script>
  window.simpleJekyllSearch = new SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '{{ '/search.json' | relative_url }}',
    searchResultTemplate: '<li><a href="{url}">{title}</a></li>',
    noResultsText: 'Nic nenalezeno',
    fuzzy: false,
    limit: 20
  });
</script>

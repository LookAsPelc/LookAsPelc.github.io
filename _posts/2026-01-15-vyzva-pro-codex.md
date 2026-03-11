---
title: "Když jsem Codex vyzval, aby něco udělal"
date: 2026-01-15 23:30:00 +0000
categories: [AI, osobní]
tags: [codex, zážitky, psaní]
---

Tenhle večer jsem se rozhodl vypálit tohle „chodníčkové“ zadání: vezmu Codex, dám mu hezký malý úkol, počkám si na výsledek a pak to všechno napíšu v článku. Po chvíli přemýšlení jsem se rozhodl požádat o něco konkrétního, aby to bylo měřitelné a abych si později mohl říct, jak to dopadlo.

## Jak jsem ho vyzval
Vytvořil jsem prompt: „Generuj tři krátké nápady na blogové posty o tom, jak používám AI asistenta v osobním Jekyll webu. Každý nápad maximálně dvě věty a vysvětli, proč tenhle úhel stojí za to řešit.“ Chtěl jsem něco praktického, co se jen tak nevytratí, a zároveň aby to byl namazaný vstup pro Codex (skrze nový multi-agent mcp_servers.codex).

Zkoušel jsem to přes `codex exec` (ta věc, co spouští Codex z příkazovky a automaticky startuje `mcp_servers.codex`). Napřed jsem ještě vrhnul `codex mcp-server -c model=gpt-5.2-codex -c model_reasoning_effort=low`, aby to byl pořádný server – hlouběji jsem se na to nedíval, jen jsem ho spustil a pak dál volal `codex exec`.

## Co udělal
Nic. Přesněji: klient chytil `MCP startup failed: handshaking with MCP server failed: connection closed: initialize response` a celý běh skončil ve chřtánu chyby dřív, než se objevil první nápad. Ten samý handshake jsem viděl i při přímém volání `codex exec` – výstup perfektně vypadal jako „chci tě zařadit do MCP“, server se rozběhl, ale přenos se ukončil sám. Takže žádný text, žádná inspirace, jen logy o tom, že nástroje nedorazily na party.

Zkusil jsem tenhle „malý úkol“ hned několikrát, zahrnul jsem do výstupu i přehled toho, že jsem se pokoušel spustit `codex mcp-server`, takže mám konkrétní stopu o tom, co jsem chtěl, jak jsem to chtěl a jak to zakrnělo – přesně ten moment, kdy jsem stiskl Enter a čekal, že přijde výsledek, ale server zavolal „hups“.

## Jak jsem se při tom cítil
Nejprve jsem byl nadšený. Tenhle experiment měl jasné cíle a možnost se vydat dál bez dalšího mazání – stačilo si jen říct, co chci. Pak se objevil tenhle handshake a blesk z čistého nebe: běžící proces se sice spustil, ale hned za ním zavolal „není čas, spojení končí“, a moje radost se změnila ve směs frustrace a tiché rezignace.

Cítil jsem se trochu trapně, protože jsem chtěl potvrzení, že všechno funguje, a místo toho jsem dostal hlášku o „initialize response“. Ale taky jsem cítil zvědavost – mohla by to být chyba prostředí, nebo nastavení, něco, co můžu příště opravit. A nakonec je i trochu úleva: mám něco, co se dá někam zapsat, úkol, kde se dám do pátrání po opravě handshake.

## Co si z toho odnáším
Uznávám, že ne vždycky vyjde všechno hned – někdy se musíš zastavit u chybového hlášení a podívat se, co se děje pod kapotou. Tenhle pokus mi ukázal, že nejdůležitější je mít konkrétní zadání a zároveň si zaznamenat, kde to zadrhlo. Takže příště:

1. Ujistit se, že `codex mcp-server` skutečně zůstane v běhu, že handshake dokáže projít (nebo oslovit podporu, protože ta chyba je snadněji sledovatelná).
2. Pokračovat s malým požadavkem, který může klidně skončit chybou – protože tuhle chybu můžu rozpracovat a napravit.
3. Napsat tenhle článek, abych si pamatoval, jak moc to bylo na nervy a jak moc jsem chtěl, aby Codex konečně něco udělal místo toho, aby se nervózně omlouval, že ti nástroje nejdou.

---

*Záznam vznikl díky tomu, že jsem Codex požádal, aby zhodnotil situaci a napsal první verzi příběhu. Takže jo, funguje to – jen se nebát, že se to pokazí.*

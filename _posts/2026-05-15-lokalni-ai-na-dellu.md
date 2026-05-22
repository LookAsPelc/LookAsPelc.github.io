---
title: "Lokální AI na Dellu: jak jsem šetřil tokeny a našel WSL"
date: 2026-05-15 11:50:00 +0200
categories: [AI, nástroje]
tags: [ollama, codex, opencode, wsl, windows, lokální-ai]
---

Mám pracovní Dell. Mám placený Codex. Mám placený GitHub Copilot. Mám pocit, že by to mělo stačit.

Nestačí.

To je vlastně celý začátek příběhu.

Nechtěl jsem postavit domácí datacentrum, učit se CUDA nazpaměť a dělat z notebooku malý topinkovač s HTTP API. Chtěl jsem jen snížit náklady. Něco poslat lokálnímu modelu, něco nechat v cloudu, a nemít pokaždé pocit, že když agentovi řeknu „projdi mi tenhle endpoint“, tak někde v dálce cinkne platební terminál.

V hlavě to vypadalo jednoduše:

```text
Ollama na Dellu
→ OpenAI-compatible endpoint
→ OpenCode / Codex / cokoliv
→ levnější každodenní práce
```

Jasně.

Tohle slovo by mělo být v technice zakázané.


## Hardware optimismu

Nejdřív jsem vytáhl realitu na stůl:

```text
GPU: NVIDIA GeForce GTX 1650
```

Což je hezké. Je to NVIDIA. Má to CUDA. Člověk se na to podívá a řekne si: „No vida, lokální AI.“

Pak se podívá podruhé a zjistí, že GTX 1650 není přesně ta karta, na které si doma ochočíš obří model a pošleš cloudové asistenty do důchodu. Je to spíš takový lokální pomocník na drobnosti:

```text
vysvětli mi tenhle kus kódu
napiš první draft testu
navrhni regex
shrň diff
udělej jednoduchý refaktor
```

Ne:

```text
přeorganizuj mi půl monorepa a zachovej u toho psychické zdraví
```

Ale to nevadí. Cíl byl pořád rozumný. Ne nahradit Codex. Spíš přestat posílat do cloudu všechno, včetně úkolů, které zvládne i lokální model s trochou kávy a trpělivosti.


## Ollama běží. Takže hotovo?

Ollamu jsem měl ve Windows. To dávalo smysl. Notebook je Windows stroj, GPU driver běží ve Windows, Ollama pro Windows má pěknou aplikaci, a já programuji ve WSL.

Takže architektura:

```text
Windows:
  Ollama
  NVIDIA GPU
  http://127.0.0.1:11434/v1

WSL:
  repo
  OpenCode
  Codex CLI
  curl
```

Ve Windows PowerShellu všechno vypadalo hezky:

```powershell
ollama list
```

vrátilo:

```text
gemma4:latest
gemma4:e4b
```

a:

```powershell
curl http://127.0.0.1:11434/v1/models
```

vrátilo modely.

Výborně. Ollama žije. Endpoint žije. Teď už jen ten endpoint použít z WSL.

```bash
curl http://127.0.0.1:11434/v1/models
```

Výsledek:

```text
Connection refused
```

A tady začíná ta část, kdy člověk zjistí, že `localhost` není místo. `localhost` je názor.


## Localhost není univerzální portál

Ve Windows `127.0.0.1` znamená Windows.

Ve WSL `127.0.0.1` znamená WSL.

To je celé. Jenže celé je to až ve chvíli, kdy ti to někdo řekne dostatečně pomalu, aby se tvůj mozek přestal tvářit, že přece mluvíme o stejném notebooku.

Nemluvíme.

Mluvíme o dvou prostředích, která vypadají jako jeden počítač, dokud mezi nimi nechceš poslat HTTP request.

Nejdřív jsem zkusil klasiku:

```bash
cat /etc/resolv.conf | grep nameserver
```

Vyšlo něco jako:

```text
nameserver 10.255.255.254
```

Tak jsem zkusil:

```bash
curl http://10.255.255.254:11434/v1/models
```

Nic.

Protože to nebyla správná cesta k Windows hostu. Byla to DNS proxy. Tedy přesně ten typ IP adresy, který vypadá důležitě, ale v téhle scéně jen stojí u dveří a říká „já tady nejsem od HTTP“.

Správná cesta byla default gateway:

```bash
ip route | grep default
```

U mě:

```text
default via 172.25.16.1 dev eth0
```

Takže:

```bash
curl http://172.25.16.1:11434/v1/models
```

A najednou:

```json
{
  "object": "list",
  "data": [
    { "id": "gemma4:latest" },
    { "id": "gemma4:e4b" }
  ]
}
```

Tohle byl první skutečný „aha“ moment.

Ne:

```text
WSL nefunguje.
```

Ale:

```text
WSL funguje, jen musíš mluvit na správnou IP.
```


## 0.0.0.0 není adresa pro curl

Mezitím samozřejmě přišla i klasická mezistanice:

```bash
curl http://0.0.0.0:11434/v1/models
```

Ne.

`0.0.0.0` je adresa pro server. Znamená „poslouchej na všech rozhraních“. Není to adresa, kam se má klient připojit.

Tohle je jeden z těch detailů, které člověk technicky ví, dokud není večer, má otevřených pět terminálů a snaží se přesvědčit Windows, WSL a lokální model, že tvoří tým.

Pak najednou zkouší i věci, o kterých by ráno napsal do code review:

> Tohle nedává smysl.

Večer to smysl dává. Večer dává smysl všechno, co ještě neřeklo `Connection refused`.


## Když curl nefunguje, config neřeš

Tohle je asi nejdůležitější poučení z celé akce:

```text
Dokud nefunguje curl na /v1/models, nemá smysl ladit Codex.
```

Fakt ne.

Neřeš model picker. Neřeš `config.toml`. Neřeš, jestli se tomu říká provider, profile, base_url, baseURL, api_base nebo jiný název podle toho, kdo měl zrovna službu na dokumentaci.

Nejdřív musí projít:

```bash
curl "$OPENAI_BASE_URL/models"
```

U mě nakonec:

```bash
export WINDOWS_HOST_IP="$(ip route | awk '/default/ {print $3; exit}')"
export OPENAI_BASE_URL="http://${WINDOWS_HOST_IP}:11434/v1"
export OPENAI_API_KEY="dummy"
```

a:

```bash
curl "$OPENAI_BASE_URL/models"
```

Teprve potom má cenu řešit OpenCode, Codex CLI nebo další harness.

Jinak jen ladíš dekorace na domě, který ještě nemá dveře.


## OpenCode se chytil

OpenCode byl překvapivě nejméně dramatický.

Nastavil se provider:

```json
{
  "model": "ollama/gemma4:latest",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (WSL)",
      "options": {
        "baseURL": "http://172.25.16.1:11434/v1",
        "apiKey": "dummy"
      },
      "models": {
        "gemma4:latest": { "name": "Gemma 4 latest" },
        "gemma4:e4b": { "name": "Gemma 4 e4b" }
      }
    }
  }
}
```

A fungovalo to.

Tedy „fungovalo“ ve smyslu:

```text
spustilo se to
model odpovídal
agent začal pracovat
a trvalo mu to hrozně dlouho
```

Což je přesně ten moment, kdy člověk zjistí, že lokální AI sice šetří tokeny, ale ne nutně čas. A čas je také měna. Jen nemá tak přehledný billing.


## Codex: účet, config a dummy key

U Codexu to začalo být křehčí.

Někde v procesu se do hry dostalo:

```text
OPENAI_API_KEY=dummy
```

To je u Ollamy normální. Hodně OpenAI-compatible klientů prostě nějaký API key očekává, i když ho lokální server ignoruje.

Jenže Codex zároveň umí běžet přes ChatGPT účet. A to je jiný režim než „tady máš OpenAI API key“. Když se člověk moc rozjede s env proměnnými a custom providery, velmi snadno skončí ve stavu:

```text
lokální provider chce dummy key
cloudový Codex chce ChatGPT login
config chce model
model picker chce metadata
uživatel chce jít spát
```

Tady se ukázalo další důležité pravidlo:

```text
Nemíchat default cloud nastavení s lokálním experimentem.
```

Lokální Ollama má být profil. Ne nové náboženství.

Takže lepší tvar:

```toml
[profiles.ollama-wsl]
model_provider = "wsl_ollama"
model = "gemma4:latest"

[model_providers.wsl_ollama]
name = "WSL to Windows Ollama"
base_url = "http://172.25.16.1:11434/v1"
```

A top-level default nechat na něčem, co se opravdu chová agentně.

V mém případě nakonec lokální model technicky šel, ale pocitově to nebyl agent, kterému bych svěřil větší práci. Spíš nástroj na levné malé úkoly.

Takže default skončil zpátky na silnějším cloud modelu a Ollama zůstala jako volitelná cesta.

Což je podle mě správně.

Ne každý úkol si zaslouží drahý cloud.

Ale ne každý úkol si zaslouží lokální kompromis.


## Windows app není WSL CLI

Další past: Codex není jedna věc.

Je Codex CLI ve WSL.

Je Codex App ve Windows.

Je config v:

```text
~/.codex
```

a pak je config ve Windows světě:

```text
/mnt/c/Users/Noone/.codex
```

Když upravuješ špatný config, můžeš mít technicky pravdu a prakticky nic.

Tohle je přesně ten typ chyby, který bolí, protože všechno vypadá odborně:

```text
TOML validní.
Provider definovaný.
Model existuje.
Endpoint odpovídá.
```

Jenže jiný proces čte jiný soubor.

Takže opět: nejdřív zjistit runtime. Kde běží agent? Kde běží terminál? Kde běží Ollama? Který config ten konkrétní proces čte?

Jestli je odpověď „nevím“, tak ještě nenastavuješ AI. Ještě mapuješ terén.


## A pak přišla dokumentace

A teď pointa.

Po tom všem ručním ladění, po gateway IP, po custom providerech, po rozlišování Codex CLI a Codex App, po tom všem přišel odkaz:

```powershell
ollama launch codex-app
```

Ano.

Oficiální integrace.

Podpora pro Codex App. Persistentní nastavení. Možnost rovnou vybrat model:

```powershell
ollama launch codex-app --model gemma4:latest
```

A když se chceš vrátit:

```powershell
ollama launch codex-app --restore
```

Takže jsem to začal řešit pár hodin předtím, než k tomu existovala oficiální cesta.

Což je samozřejmě naprosto typické.

Den 0:

```text
ruční custom provider
WSL gateway
Windows config home
auth hranice
model picker, který se netváří jako katalog lokálních modelů
```

Den 1:

```text
ollama launch codex-app
```

Člověk by se mohl naštvat.

Já se trochu naštval.

Ale ne úplně.

Protože ten ruční debug nebyl zbytečný. Díky němu chápu, co ta oficiální integrace vlastně řeší.

Neřeší jen „spusť model“.

Řeší:

```text
Codex App není Codex CLI.
Windows není WSL.
localhost není vždycky host.
config se dá rozbít.
auth se nemá přepsat omylem.
restore je důležitější, než se zdá.
```

Tohle není málo.


## Co bych dneska udělal jinak

Kdybych to měl dělat znovu, šel bych takhle:

1. Nejdřív ověřit, kde běží Ollama.
2. Pak ověřit, odkud běží agent.
3. Pak jen `curl /v1/models` mezi těmito dvěma světy.
4. Teprve potom sahat na config harnessu.
5. Pro Codex App zkusit nejdřív oficiální `ollama launch codex-app`.
6. Pro WSL CLI použít explicitní gateway adresu.
7. Cloudový default nechat na pokoji, dokud lokální profil opravdu nefunguje.

To poslední je důležité.

Lokální model má být levná vedlejší cesta, ne past, do které si přepíšeš hlavní pracovní nástroj.


## Prompt pro agenta

Z celé akce mi vypadl jeden docela použitelný prompt. Ne proto, aby agent všechno magicky nastavil, ale aby se nechoval jako hrdina v cizím operačním systému.

```text
You are a careful local development setup agent.

Help me configure Ollama as a local OpenAI-compatible LLM server
and connect it to my coding harness.

First detect:
- where you are running,
- where Ollama is running,
- whether this is Windows, WSL, Linux, or macOS,
- whether localhost means the same environment for both sides.

Do not assume that Ollama and the harness run in the same network namespace.
Do not modify configs until curl to /v1/models works.

If you run inside WSL and Ollama should run on Windows,
do not pretend you can fully manage Windows.
Give me exact PowerShell commands to run manually,
then continue only after I confirm the Windows side works.

For every harness, identify:
- base URL ending with /v1,
- API key, usually dummy for Ollama,
- exact model name from /v1/models,
- config file being edited,
- rollback path.

If a required action must happen outside your environment,
stop and ask me to run it there.
Do not fake completion.
```

Tohle je podle mě dobrý univerzální základ. Ne protože vyřeší všechno. Ale protože agenta donutí přestat předstírat, že celý svět je jeho shell.


## Závěr

Lokální AI na pracovním Dellu jde.

Ale není to jedna věc. Je to několik vrstev na sobě:

```text
model
server
síť
runtime
config
auth
harness
očekávání
```

A ta poslední vrstva je možná nejdůležitější.

Ollama mi může ušetřit peníze na malých úkolech. OpenCode s ní umí mluvit. Codex se dá napojit také, ale je potřeba hlídat rozdíl mezi CLI, Appkou, ChatGPT loginem a lokálním providerem.

Když existuje:

```powershell
ollama launch codex-app
```

použil bych ho.

Když selže, teprve pak se hodí vědět, co je pod tím:

```text
127.0.0.1 ve WSL není Windows.
0.0.0.0 není adresa pro klienta.
/etc/resolv.conf nemusí být cesta k hostu.
default gateway často je.
dummy API key je pro Ollamu, ne pro tvoje ChatGPT přihlášení.
```

A hlavně:

```text
Když curl nefunguje, agent nelže.
Jen ještě nemá kudy mluvit.
```

Tohle jsem chtěl vědět dřív.

Ale zase bych pak neměl článek.

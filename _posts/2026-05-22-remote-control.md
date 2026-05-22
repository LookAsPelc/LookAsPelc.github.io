---
title: "Remote control: telefon, Tailscale, SSH a večer v tahu"
date: 2026-05-22 20:50:00 +0200
categories: [AI, nástroje]
tags: [codex, ssh, tailscale, wsl, android, terminal]
---

Zase se snažím rozchodit něco, co mi zítra rozchodí inžové z OpenAI. Jenomže tickety do práce jsou hotové, a tohle je forma prokrastinace. Čeká mě víkend v lese a dost by se mi hodilo pořídit si nový bič na agenty. Něco co mi umožní je vybičovat k halicnogením výkonům i ze záchoda. (Samozřejmě nechodím na záchod s telefonem, tam má správný stolicista meditovat.)

Cíl by měl být docela jednoduchý:

> Chci ovládat agenty z telefonu. Odkudkoliv.

Jaké agenty? To je skoro jedno. Codex, OpenCode, nějaký lokální asistent, obyčejný terminál, cokoliv. Myšlenka je prostá: když mám vzdálený přístup k terminálu, mám vlastně vzdálený přístup ke všemu co potřebuji.


## Teorie

Jasně, to je staré známé SSH.

Na stroji běží OpenSSH server. Na telefonu je SSH klient. Připojím se, spustím `tmux`, uvnitř `codex`, zavřu telefon a proces si žije dál. Krása.

Jinými slovy: telefon → SSH → WSL → tmux → Codex.

Jenže z cizí sítě bych potřeboval veřejnou IP adresu, port forwarding, firewall na routeru, dynamické DNS ...nevim, nejsem síťař.

To by měl vyřešit [TailScale](https://tailscale.com/) ...teda, alespoň ChatGPT to tvrdí. Mám pocit, že jim teď musí nehorázně přibývat zákazníků, ptože ChatGPT to předepisuje jako piluklu proti tloustnutí.

Takže takhle: telefon -> Tailscale -> počítač -> WSL -> SSH


Žádné veřejné porty. Žádné hraní si s routerem. Každé zařízení dostane vlastní adresu v tailnetu a všechno se tváří, jako by to bylo na jedné soukromé síti.


## Praxe

Nejdřív jsem to řešil s ChatGPT. Pak jsem narazil na první problémy, tak jsem sdílel konverzaci přes link a hodil ji do Codexu. Model radši silnější, reasoning radši vyšší, protože už jsem cítil, že to nebude jen:

```bash
sudo apt install hotovo
```

Postupně jsme nastavili:

- Tailscale ve Windows ...teda tam už byl.
- Tailscale přímo ve WSL.
- OpenSSH server ve WSL.
- `authorized_keys`.
- Termius na telefonu.
- `tmux`.
- alias `cx`, protože psát na telefonu `tmux new -A -s codex` na telefonu nedám.

Vypadalo to hezky.

WSL mělo vlastní Tailscale IP. Windows měly vlastní Tailscale IP. Telefon byl v tailnetu. Tailscale aplikace tvrdila, že všechno žije. Ping na zařízení procházel. Na papíře hotovo.

Pak jsem otevřel Termius.

## První rána: MagicDNS

Termius se snažil připojit na něco jako:

```text
wind-1.tailnet.ts.net
```

a spadl na:

```text
Address resolution finished with error: no address
```

To vypadalo jako problém SSH, ale nebyl. SSH server se k tomu vůbec nedostal. Telefon si prostě neuměl přeložit MagicDNS jméno.

Takže místo hezkého jména přišla hrubá síla:

```text
Host: 100.x.y.z
Port: 22
User: lukas
```

## Druhá rána: split tunneling

Další chyba byla:

```text
Connection timed out
```

Tady už to začalo vypadat podezřele. SSH server ve WSL běžel. Port 22 poslouchal. Z Windows přes Tailscale šel test na port 22. Z WSL na vlastní Tailscale IP taky. Telefon v Tailscale aplikaci viděl všechno.

Ale Termius nic.

Nakonec se ukázalo, že problém byl Androidí split tunneling. Tailscale sice běžel, ale Termius zřejmě nebyl aplikace, které bylo dovoleno přes VPN opravdu mluvit.

Tohle je přesně ten typ nastavení, které existuje proto, aby ti pomohlo, a v praxi ti jen půl hodiny vesele lže do očí.

Po zapnutí Tailscale pro všechny aplikace se situace posunula. A to je důležité: neposunula se do stavu „funguje“, ale do stavu „rozbilo se to jinak“.

Což je v debugování skoro optimismus.

## Třetí rána: port 22 a Chrome

Zkoušeli jsme ověřit, jestli se telefon vůbec dostane na WSL přes Tailscale. Spustil jsem ve WSL malý HTTP server na portu `8088`.

Na telefonu jsem otevřel:

```text
http://100.x.y.z:8088/
```

a přišlo:

```text
OK from WSL over Tailscale
```

Takže síť funguje.

Předtím jsem zkusil i port 22 v prohlížeči, jenže Chrome zahlásil:

```text
ERR_UNSAFE_PORT
```

To zní jako „něco je špatně se sítí“, ale ve skutečnosti to znamená „Chrome odmítá sahat na tenhle port, protože je to Chrome a má na věci názor“. Férově, zrovna tady měl i pravdu. Port 22 je SSH, ne web.

Poučení: testovat SSH port prohlížečem je možné, ale pouze pokud zrovna nepotřebuješ výsledek, který dává smysl.

## Čtvrtá rána: klíče

Pak přišly SSH klíče.

V Termiusu byl klíč. Ve WSL byl public key. Fingerprint seděl. Ale spojení pořád viselo na:

```text
Connecting...
```

Bez chyby.

Bez vysvětlení.

Bez slušnosti.

Tak jsme vytvořili nový klíč bez passphrase. Přidali ho do `authorized_keys`. Pořád nic.

Pak jsem zkusil ConnectBot. Nový klient, nový RSA klíč, nový pokus, stará naděje. Klíč jsme přidali taky.

Výsledek?

Stejný.

V tu chvíli už člověk začne podezírat věci, které normálně nepodezírá. Port 22. Firewall. Windows. WSL. Android. Termius. ConnectBot. Vlastní rozhodnutí z roku 2019. Všechno.

## Co jsme ověřili

Abych nebyl nespravedlivý, debugování nebylo úplně marné. Ověřili jsme docela hodně:

```text
Tailscale z telefonu do WSL funguje.
HTTP test na portu 8088 prošel.
SSH server ve WSL běží.
Port 22 je otevřený.
Windows se na WSL port 22 přes Tailscale dostane.
WSL se na vlastní Tailscale port 22 dostane.
Klíče jsou v authorized_keys.
Fingerprinty sedí.
```

Takže problém není „Tailscale nefunguje“. Problém je někde v kombinaci Android SSH klient → Tailscale → SSH handshake → WSL. A to je přesně ta věta, po které už víš, že dneska večeři nevaříš.

## Co jsem z toho chtěl

Já vlastně nechtěl nic velkého.

Chtěl jsem mít možnost vzít telefon, připojit se do `tmux` session a napsat:

```bash
cx
```

a být zpátky ve své práci. Třeba z gauče. Třeba z vlaku. Třeba z místa, kde bych normálně napsal jen „mrknu na to večer“, ale místo toho bych mohl opravdu něco opravit.

Tohle je na agentech zajímavé. Nepotřebuješ nutně tahat celé IDE. Nepotřebuješ obří obrazovku. Často potřebuješ jen terminál, trpělivost a možnost říct agentovi:

> pokračuj, ověř, commitni, napiš mi co se stalo

Telefon není ideální pracovní stanice. Ale jako dálkové ovládání k běžícímu pracovnímu prostředí? To je lákavé.

## Co si z toho odnáším

Za prvé: Tailscale není kouzlo. Je to výborný nástroj, ale když se něco pokazí, člověk velmi rychle skončí mezi DNS, routami, Android VPN nastavením a SSH logy. Tedy přesně tam, kde jsem původně být nechtěl.

Za druhé: `tmux` je pořád základ. Kdybych to celé rozchodil, všechno dlouhé by stejně běželo uvnitř tmuxu. Ne proto, že je to cool, ale proto, že telefonní připojení je věc křehká a člověk nechce přijít o běžící proces jen proto, že přejel prstem blbě přes displej.

Za třetí: debugovat s AI je zvláštní druh komfortu. Na jednu stranu jsem se zasekl. Na druhou stranu jsem měl vedle sebe někoho, kdo pořád dokola hlídal:

- podívej se do logu,
- ověř port,
- odděl síť od SSH,
- netipuj, měř.

Což je přesně ten hlas, který bych sám sobě měl pouštět častěji.

## Stav mise

Mise zatím není splněná.

Telefon se přes Tailscale na WSL dostane. Webový test prošel. SSH server žije. Klíče jsou přidané. Ale samotné SSH z Android klienta pořád není tam, kde ho chci mít.

Takže výsledek dnešního večera je:

```text
remote control: 70 %
frustrace: 91 %
článek: 100 %
```

A víš co? To není špatné.

Někdy člověk nerozchodí nástroj. Ale aspoň rozchodí příběh.

Příště buď zjistím, co blokuje SSH handshake z Androidu, nebo to celé obejdu jinou cestou. Možná přes jiného klienta. Možná přes Tailscale SSH. Možná přes něco, co se bude tvářit jednoduše a pak mi vezme další večer.

Těším se.

Asi.

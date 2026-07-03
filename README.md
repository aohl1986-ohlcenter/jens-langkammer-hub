# jens-langkammer.de — Personal Brand Hub

[![Link Check](https://github.com/aohl1986-ohlcenter/jens-langkammer-hub/actions/workflows/link-check.yml/badge.svg)](https://github.com/aohl1986-ohlcenter/jens-langkammer-hub/actions/workflows/link-check.yml)

Hochperformante Personal-Branding- und Entity-SEO-Seite für **Jens Langkammer** (Director, Strategy& / PwC — Consumer Markets & eGrocery).

**Live:** [jens-langkammer.de](https://jens-langkammer.de)

Umgesetzt von [Pragma Code](https://www.pragma-code.de) — bewusst als framework-freie statische Seite gebaut: kein Build-Step, keine Dependencies, maximale Performance.

## Tech-Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — keine Frameworks, keine Abhängigkeiten
- **Apache-Hosting** — Konfiguration über `.htaccess`

## Features

### Entity-SEO & Auffindbarkeit
- Konsolidierter **JSON-LD Entity-Graph** (Schema.org) zur Verankerung der Person im Google Knowledge Graph und für AI-Systeme
- `sitemap.xml`, `robots.txt` und [`llms.txt`](llms.txt) für klassische Suchmaschinen und LLM-Crawler
- **IndexNow**-Anbindung für sofortige Index-Updates (`ea4b….txt` ist die Key-Verifikationsdatei)
- Canonical- und Hreflang-Tags, Open-Graph- und Twitter-Card-Meta

### Performance
- WebP-Bilder mit `preload`, asynchron geladene Google Fonts (kein Render-Blocking)
- Browser-Caching und Kompression via `.htaccess`, Cache-Busting über Versions-Parameter
- Theme wird vor dem ersten Paint gesetzt (kein Flash of Unstyled Content)

### UX & Datenschutz (DSGVO)
- Light/Dark-Mode mit `localStorage`-Persistenz
- LinkedIn-Posts als **Click-to-Load-Lightbox** — externe Inhalte laden erst nach aktiver Einwilligung
- Cookie-Consent-Banner, Impressum und Datenschutzerklärung

## Struktur

```
index.html          # One-Pager mit JSON-LD Entity-Graph
styles.css          # Design-System inkl. Light/Dark-Theme
script.js           # Theme-Switcher, Lightbox, Interaktionen
impressum.html      # Rechtliches
datenschutz.html    # Rechtliches
.htaccess           # HTTPS/non-www-Redirects, Caching, Kompression
llms.txt            # Kontext für LLM-Crawler
```

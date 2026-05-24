# Cotton + Comber Live Dashboard

Open `index.html` directly, or host this folder on Cloudflare Pages.

## What it tracks
- ICE Cotton futures
- Cotlook A / FC Index M / Brazil cotton
- NCDEX Cocud and Kapas
- China CC3128B, ZCE cotton/yarn
- USD/INR, WTI crude
- Indian cotton arrivals
- CCI weekly/season sales
- Historical comber noil context from old Cotton Advisory data

## Live data approach
The dashboard reads `live-data.json`. For true daily live refresh, run a cron/worker that fetches official sources and overwrites `live-data.json` or writes to a DB endpoint.

Some feeds are delayed/paywalled:
- ICE and Cotlook true realtime usually require paid market-data access.
- NCDEX public live quotes are the easiest official live source.
- CAI/CCI are daily/weekly references, not tick-by-tick.

## Comber model logic
Positive comber pressure:
- ICE up
- Cotlook/Indian spot up
- NCDEX cocud up
- arrivals down
- CCI sales down
- China demand up
- USD/INR up
- WTI/polyester up

Negative comber pressure is the reverse.

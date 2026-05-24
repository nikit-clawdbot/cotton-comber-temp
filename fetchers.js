/**
 * Cotton + Comber dashboard fetcher skeleton.
 * Run daily via cron/Cloudflare Worker/GitHub Action and overwrite live-data.json.
 * Notes:
 * - NCDEX public pages can be parsed, but layout may change.
 * - ICE/Cotlook true real-time requires paid API/subscription; use official API if available.
 * - CAI/CCI are daily/weekly references and may need HTML/PDF parsing.
 */
import fs from 'node:fs/promises';

const sources = {
  ncdexLive: 'https://ncdex.com/index.php/market-watch/live_quotes',
  ncdexMis: 'https://ncdex.com/index.php/markets/misreport',
  ncdexSpot: 'https://ncdex.com/index.php/markets/livespot',
  caiArrivals: 'https://in-cai.in/pages/state-wise-estimates-of-daily-cotton-arrivals',
  cciSales: 'https://cotcorp.websteptech.co.uk/domestic-sales',
  iceCotton: 'https://www.ice.com/products/254/Cotton-No-2-Futures/data',
  cotlook: 'https://www.cotlook.com/prices/cotlook-a-index/',
  cepeaBrazil: 'https://cepea.org.br/br/indicador/algodao.aspx',
  cnceChina: 'http://www.cnce.cn/index.php',
  fbil: 'https://www.fbil.org.in/',
  cmeWti: 'https://www.cmegroup.com/markets/energy/crude-oil/light-sweet-crude.html'
};

async function fetchText(url){
  const res = await fetch(url, {headers:{'user-agent':'Mozilla/5.0 cotton-market-dashboard'}});
  if(!res.ok) throw new Error(`${url} ${res.status}`);
  return await res.text();
}

async function buildFeed(){
  // Production: parse each official source and fill these values.
  // Current fallback keeps latest extracted infographic values so dashboard stays usable offline.
  const feed = JSON.parse(await fs.readFile(new URL('./live-data.json', import.meta.url), 'utf8'));
  feed.asOf = new Date().toISOString().slice(0,10);
  feed.fetchNotes = {
    officialSources: sources,
    warning: 'Replace fallback values with parsed official data or paid market-data API where required.'
  };
  return feed;
}

const feed = await buildFeed();
await fs.writeFile(new URL('./live-data.json', import.meta.url), JSON.stringify(feed,null,2));
console.log('updated live-data.json', feed.asOf);

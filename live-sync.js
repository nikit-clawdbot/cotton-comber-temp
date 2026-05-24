// Browser-side live sync helper. Uses public RSS/CORS-friendly endpoints where possible.
// Exchange-grade realtime (ICE/Cotlook) generally requires paid APIs; this enriches dashboard with public news + fallback feed.
async function fetchRSS2JSON(url){
  const api='https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(url);
  const res=await fetch(api); if(!res.ok) throw new Error('rss '+res.status); return await res.json();
}
async function fetchCottonNews(){
  const feeds=[
    'https://news.google.com/rss/search?q=cotton%20market%20OR%20cotton%20exports%20OR%20cotton%20import%20OR%20cotton%20trade%20deal%20OR%20textile%20tariff%20when:7d&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=ICE%20cotton%20futures%20USDA%20export%20sales%20when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=China%20cotton%20import%20yarn%20demand%20Xinjiang%20tariff%20when:14d&hl=en-US&gl=US&ceid=US:en'
  ];
  const all=[];
  for(const f of feeds){try{const j=await fetchRSS2JSON(f); (j.items||[]).slice(0,8).forEach(x=>all.push(x));}catch(e){}}
  const seen=new Set();
  return all.filter(x=>{const k=(x.title||'').toLowerCase().slice(0,80); if(seen.has(k)) return false; seen.add(k); return true;}).slice(0,18).map(x=>({
    title:x.title, link:x.link, source:x.author||'Google News', date:x.pubDate||'', category:classifyNews(x.title+' '+(x.description||'')), impact:newsImpact(x.title+' '+(x.description||''))
  }));
}
function classifyNews(t){t=t.toLowerCase(); if(/tariff|trade deal|duty|sanction|politic|trump|china|us |import ban/.test(t)) return 'Trade/Politics'; if(/export|import|shipment|sales/.test(t)) return 'Import/Export'; if(/weather|crop|usda|acreage|production|arrival/.test(t)) return 'Crop/Supply'; if(/yarn|textile|mill|demand/.test(t)) return 'Yarn/Demand'; return 'Market';}
function newsImpact(t){t=t.toLowerCase(); let s=0; if(/export sales|demand|import rises|crop damage|lower crop|weather risk|tariff on imports|supply tight/.test(t)) s+=1; if(/weak demand|exports fall|higher production|bumper crop|tariff pressure|sanction|recession/.test(t)) s-=1; return s>0?'Supportive':s<0?'Pressure':'Watch';}
window.fetchCottonNews=fetchCottonNews;

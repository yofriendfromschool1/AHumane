import { chromium } from 'playwright-core';
const base='http://127.0.0.1:3210';
const routes=['/','/ai-humanizer','/ai-detector','/plagiarism-checker','/chrome','/pricing','/about','/how-it-works','/blog','/blog/introducing-ahumane','/help','/status','/login','/terms','/privacy','/plans','/studio','/studio/humanizer','/studio/detector','/studio/plagiarism','/studio/documents','/studio/writer','/studio/settings','/nonexistent'];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
for (const [w,h] of [[1440,950],[390,844]]) {
 const page=await browser.newPage({viewport:{width:w,height:h}});
 let bad=0;
 for (const route of routes) {
  let status=0;
  try { const r=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000}); status=r?.status()??0; await page.waitForTimeout(300); } catch(e) { console.log('NAVFAIL',route); bad++; continue; }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
  const expected = route==='/nonexistent'?404: (route==='/plans'?200:200);
  if (status!==expected || overflow) { console.log('BAD',w,route,status,overflow); bad++; }
 }
 console.log('width',w,'bad',bad,'of',routes.length);
 await page.close();
}
await browser.close();

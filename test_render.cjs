const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text());
  });

  page.on('pageerror', error => {
    console.log('PAGE UNCAUGHT ERROR:', error.message);
  });
  
  try {
    await page.goto('http://localhost:5173/news?tab=schedules', { waitUntil: 'networkidle2' });
    console.log('Loaded news page with schedules tab.');
    
    // Wait a bit for render
    await new Promise(r => setTimeout(r, 3000));
    
    // Check if the page is empty
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('body2.html', bodyHTML);
    console.log('Wrote body2.html');
  } catch (e) {
    console.error('Script error:', e);
  } finally {
    await browser.close();
  }
})();

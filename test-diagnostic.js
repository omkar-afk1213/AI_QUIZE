import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('📱 Opening deployed app...');
    await page.goto('https://ai-quize.vercel.app', { waitUntil: 'domcontentloaded' });
    
    console.log('⏳ Waiting for React to render (5 seconds)...');
    await page.waitForTimeout(5000);
    
    console.log('\n📊 Analyzing page...');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    // Get page HTML
    const html = await page.content();
    console.log('HTML length:', html.length);
    console.log('Has "quiz":', html.toLowerCase().includes('quiz'));
    console.log('Has "login":', html.toLowerCase().includes('login'));
    
    // Take a screenshot
    await page.screenshot({ path: 'diagnostic.png', fullPage: true });
    console.log('✅ Full page screenshot saved: diagnostic.png');
    
    // Evaluate to see what's visible
    const visibility = await page.evaluate(() => {
      return {
        documentReady: document.readyState,
        bodyContent: document.body.innerHTML.substring(0, 500),
      };
    });
    
    console.log('\n📄 Document ready state:', visibility.documentReady);
    console.log('Body content preview:', visibility.bodyContent);
    
    console.log('\n✅ Diagnostic complete. Check diagnostic.png for visual inspection.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();

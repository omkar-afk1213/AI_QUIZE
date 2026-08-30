import { chromium } from 'playwright';

(async () => {
  // Create a fresh browser context with no cookies or storage
  const browser = await chromium.launch({ headless: false });
  
  // Create a private/incognito context
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('\n🧪 TESTING: Fresh User Visiting Deployed App');
    console.log('='.repeat(70));
    
    console.log('\n🌐 Opening: https://ai-quize.vercel.app');
    console.log('   (Fresh browser - no cache, no cookies)');
    
    await page.goto('https://ai-quize.vercel.app', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const url = page.url();
    const title = await page.title();
    console.log('\n✅ Page Loaded');
    console.log('   URL:', url);
    console.log('   Title:', title);
    
    // Check what's displayed
    const pageText = await page.content();
    
    const hasLoginForm = pageText.includes('Username') && pageText.includes('Password');
    const hasLoginButton = pageText.includes('Login as Admin') || pageText.includes('Login as User');
    const hasAdminTab = pageText.includes('Admin Login');
    const hasUserTab = pageText.includes('User Login');
    const hasQuizContent = pageText.includes('questions') || pageText.includes('Next');
    
    console.log('\n📋 Page Content Analysis:');
    console.log(`   Has Login Form: ${hasLoginForm ? '✅ YES' : '❌ NO'}`);
    console.log(`   Has Login Button: ${hasLoginButton ? '✅ YES' : '❌ NO'}`);
    console.log(`   Has Admin/User Tabs: ${hasAdminTab && hasUserTab ? '✅ YES' : '❌ NO'}`);
    console.log(`   Has Quiz Content: ${hasQuizContent ? '⚠️  YES (BAD)' : '✅ NO (GOOD)'}`);
    
    if (hasLoginForm && hasLoginButton && hasAdminTab) {
      console.log('\n✅ RESULT: LOGIN PAGE IS SHOWING CORRECTLY');
      console.log('   Fresh users will see the login page ✓');
    } else {
      console.log('\n❌ RESULT: LOGIN PAGE NOT SHOWING');
      console.log('   Something is wrong with the deployment');
    }
    
    await page.screenshot({ path: 'fresh-user-test.png', fullPage: true });
    console.log('\n📸 Screenshot: fresh-user-test.png');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }
})();

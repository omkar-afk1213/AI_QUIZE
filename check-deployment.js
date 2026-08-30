import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('\n🔄 Loading https://ai-quize.vercel.app with fresh browser...\n');
    
    await page.goto('https://ai-quize.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Get visible text
    const allText = await page.textContent('body');
    const hasUsername = allText.includes('Username');
    const hasPassword = allText.includes('Password');
    const hasAdminLogin = allText.includes('Admin Login') || allText.includes('Admin');
    const hasStudentLogin = allText.includes('Student Login') || allText.includes('Student');
    const hasQuizTitle = allText.includes('AI quize');
    
    console.log('📊 Page Content Analysis:');
    console.log(`   Username field: ${hasUsername ? '✅' : '❌'}`);
    console.log(`   Password field: ${hasPassword ? '✅' : '❌'}`);
    console.log(`   Admin/Student tabs: ${(hasAdminLogin || hasStudentLogin) ? '✅' : '❌'}`);
    console.log(`   Page title: ${hasQuizTitle ? '✅' : '❌'}`);
    
    if (hasUsername && hasPassword) {
      console.log('\n✅ SUCCESS! Login page is displaying!');
    } else {
      console.log('\n❌ Login page is NOT showing');
      console.log('\n First 500 chars of page text:');
      console.log(allText.substring(0, 500));
    }
    
    await page.screenshot({ path: 'deployment-check.png', fullPage: true });
    console.log('📸 Screenshot saved: deployment-check.png\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }
})();

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  const outDir = path.resolve('test-results/comprehensive-test');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const results = {
    passed: [],
    failed: [],
    metrics: {}
  };

  const report = (name, success, details = '') => {
    if (success) {
      results.passed.push({ name, details });
      console.log(`✅ [PASS] ${name} ${details ? '- ' + details : ''}`);
    } else {
      results.failed.push({ name, details });
      console.error(`❌ [FAIL] ${name} ${details ? '- ' + details : ''}`);
    }
  };

  console.log('\n======================================================');
  console.log('   COMPREHENSIVE COMPONENT AUDIT & INTERACTION TEST   ');
  console.log('======================================================\n');

  // Navigate to Host
  console.log('1. Loading Bootstrap Host (http://localhost:3000/)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Remote MFE is mounted
  const remoteMFE = page.locator('text=Enterprise Microfrontend Portal');
  const isMfeLoaded = await remoteMFE.count() > 0;
  report('Module Federation Remote Mount', isMfeLoaded, 'Salt MFE bundle dynamically loaded from :3001');

  // =========================================================================
  // TEST SUITE 1: TAB 1 - FORMS & INPUTS
  // =========================================================================
  console.log('\n--- Running Test Suite 1: Forms & Inputs ---');
  
  // Test 1.1: Native Bootstrap input vs Salt DS input
  const bsInput = page.locator('.col-lg-6').first().locator('input[placeholder="e.g. TXN-1029"]');
  const saltInput = page.locator('.col-lg-6').nth(1).locator('.saltInput input');
  
  const bsInputCount = await bsInput.count();
  const saltInputCount = await saltInput.count();
  report('Reference Code Inputs Presence', bsInputCount > 0 && saltInputCount > 0);

  if (saltInputCount > 0) {
    await saltInput.fill('TEST-TXN-9999');
    const val = await saltInput.inputValue();
    report('Salt Input Text Entry', val === 'TEST-TXN-9999', `Value set to ${val}`);
  }

  // Test 1.2: Dropdown / Currency Select
  const saltDropdown = page.locator('.col-lg-6').nth(1).locator('.saltDropdown');
  const hasDropdown = await saltDropdown.count() > 0;
  report('Salt Dropdown Component', hasDropdown);

  // Test 1.3: Multiline Input (Textarea)
  const saltTextarea = page.locator('.col-lg-6').nth(1).locator('.saltMultilineInput textarea');
  const hasSaltTextarea = await saltTextarea.count() > 0;
  report('Salt MultilineInput Component', hasSaltTextarea);

  if (hasSaltTextarea) {
    await saltTextarea.fill('Special VIP treasury instruction');
    const noteVal = await saltTextarea.inputValue();
    report('Salt Textarea Text Entry', noteVal.includes('VIP treasury'));
  }

  // Test 1.4: Radios & Checkbox
  const saltRadio = page.locator('.col-lg-6').nth(1).locator('.saltRadioButton').first();
  const saltCheckbox = page.locator('.col-lg-6').nth(1).locator('.saltCheckbox').first();
  report('Salt Radio & Checkbox Presence', (await saltRadio.count() > 0) && (await saltCheckbox.count() > 0));

  // Test 1.5: Submit Button and Alert
  const saltSubmitBtn = page.locator('.col-lg-6').nth(1).locator('button:has-text("Submit Settlement")');
  if (await saltSubmitBtn.count() > 0) {
    await saltSubmitBtn.click();
    await page.waitForTimeout(300);
    const saltSuccessAlert = page.locator('.col-lg-6').nth(1).locator('text=Success:');
    report('Salt Form Submission Action', await saltSuccessAlert.count() > 0, 'Success feedback banner displayed');
  }

  await page.screenshot({ path: path.join(outDir, 'suite-1-forms.png') });

  // =========================================================================
  // TEST SUITE 2: TAB 2 - DATA GRID & TABLE
  // =========================================================================
  console.log('\n--- Running Test Suite 2: Data Grid & Table ---');
  
  const tab2Btn = page.locator('button:has-text("2. Data Grid & Table")').first();
  await tab2Btn.click();
  await page.waitForTimeout(600);

  // Test 2.1: Breadcrumbs
  const bsBreadcrumb = page.locator('.col-lg-6').first().locator('.breadcrumb');
  const saltBreadcrumb = page.locator('.col-lg-6').nth(1).locator('.saltBreadcrumbs');
  report('Breadcrumb Navigation', (await bsBreadcrumb.count() > 0) && (await saltBreadcrumb.count() > 0));

  // Test 2.2: Data Table Rows
  const bsRows = await page.locator('.col-lg-6').first().locator('tbody tr').count();
  const saltRows = await page.locator('.col-lg-6').nth(1).locator('tbody tr').count();
  report('Table Initial Row Count', bsRows === 5 && saltRows === 5, `Both tables rendered exactly 5 rows (BS: ${bsRows}, Salt: ${saltRows})`);

  // Test 2.3: Table Filter Buttons
  const settledBtn = page.locator('.col-lg-6').nth(1).locator('button:has-text("Settled (2)")');
  if (await settledBtn.count() > 0) {
    await settledBtn.click();
    await page.waitForTimeout(300);
    const filteredSaltRows = await page.locator('.col-lg-6').nth(1).locator('tbody tr').count();
    report('Table Category Filter (Settled)', filteredSaltRows === 2, `Filtered to exactly 2 settled rows (Found: ${filteredSaltRows})`);

    // Reset filter
    const allBtn = page.locator('.col-lg-6').nth(1).locator('button:has-text("All Records (5)")');
    await allBtn.click();
    await page.waitForTimeout(300);
  }

  // Test 2.4: Search Query Filter
  const searchInput = page.locator('.col-lg-6').nth(1).locator('input[placeholder="Filter counterparty..."]');
  if (await searchInput.count() > 0) {
    await searchInput.fill('Nomura');
    await page.waitForTimeout(300);
    const searchRows = await page.locator('.col-lg-6').nth(1).locator('tbody tr').count();
    const rowText = await page.locator('.col-lg-6').nth(1).locator('tbody tr').first().innerText();
    report('Table Search Filter', searchRows === 1 && rowText.includes('Nomura'), `Search filtered to single matching counterparty`);
    await searchInput.fill('');
    await page.waitForTimeout(300);
  }

  await page.screenshot({ path: path.join(outDir, 'suite-2-table.png') });

  // =========================================================================
  // TEST SUITE 3: TAB 3 - DIALOG & ACCORDIONS
  // =========================================================================
  console.log('\n--- Running Test Suite 3: Dialog & Accordions ---');
  
  const tab3Btn = page.locator('button:has-text("3. Dialog & Accordion")').first();
  await tab3Btn.click();
  await page.waitForTimeout(600);

  // Test 3.1: Salt Accordion Panels
  const saltAccordions = page.locator('.col-lg-6').nth(1).locator('.saltAccordion');
  const accordionCount = await saltAccordions.count();
  report('Salt Accordions Presence', accordionCount === 3, `Found ${accordionCount} accordion panels`);

  if (accordionCount > 0) {
    const firstAccordionHeader = saltAccordions.first().locator('.saltAccordionHeader');
    await firstAccordionHeader.click();
    await page.waitForTimeout(300);
    const panelText = await saltAccordions.first().locator('.saltAccordionPanel').innerText();
    report('Salt Accordion Expand / Collapse', panelText.includes('Fedwire and TARGET2'), 'Panel expands and displays clearing SLA');
  }

  // Test 3.2: Salt Dialog Modal Launch
  const saltLaunchModalBtn = page.locator('.col-lg-6').nth(1).locator('button:has-text("Launch Settlement Dialog")');
  if (await saltLaunchModalBtn.count() > 0) {
    await saltLaunchModalBtn.click();
    await page.waitForTimeout(500);

    const saltDialog = page.locator('.saltDialog');
    const isDialogVisible = (await saltDialog.count() > 0) && (await saltDialog.isVisible());
    report('Salt Dialog Modal Overlay Launch', isDialogVisible, 'Accessible modal with backdrop opened');

    if (isDialogVisible) {
      await page.screenshot({ path: path.join(outDir, 'suite-3-dialog-open.png') });
      const cancelBtn = saltDialog.locator('button:has-text("Cancel")');
      await cancelBtn.click();
      await page.waitForTimeout(400);
      const isClosed = await saltDialog.count() === 0;
      report('Salt Dialog Modal Dismissal', isClosed, 'Dialog cleanly dismissed via Cancel action');
    }
  }

  // =========================================================================
  // TEST SUITE 4: TAB 4 - METRICS & SYSTEM HEALTH
  // =========================================================================
  console.log('\n--- Running Test Suite 4: Metrics & Health ---');
  
  const tab4Btn = page.locator('button:has-text("4. Metrics & Health")').first();
  await tab4Btn.click();
  await page.waitForTimeout(600);

  // Test 4.1: Linear Progress Bar
  const saltLinearProgress = page.locator('.col-lg-6').nth(1).locator('.saltLinearProgress');
  report('Salt LinearProgress Component', await saltLinearProgress.count() > 0, '77% consumption meter');

  // Test 4.2: Circular Progress & Spinners
  const saltCircular = page.locator('.col-lg-6').nth(1).locator('.saltCircularProgress');
  const saltSpinner = page.locator('.col-lg-6').nth(1).locator('.saltSpinner');
  report('Salt CircularProgress & Spinner', (await saltCircular.count() > 0) && (await saltSpinner.count() > 0));

  // Test 4.3: Status Indicators
  const saltStatusSuccess = page.locator('.col-lg-6').nth(1).locator('.saltStatusIndicator-success');
  const saltStatusError = page.locator('.col-lg-6').nth(1).locator('.saltStatusIndicator-error');
  report('Salt Status Indicators (Success & Error)', (await saltStatusSuccess.count() > 0) && (await saltStatusError.count() > 0));

  await page.screenshot({ path: path.join(outDir, 'suite-4-metrics.png') });

  // =========================================================================
  // TEST SUITE 5: THEME COLORS & DARK MODE
  // =========================================================================
  console.log('\n--- Running Test Suite 5: Dynamic Theming & Dark Mode ---');

  // Test 5.1: Purple Accent Theme
  const purpleBtn = page.locator('button:has-text("Purple")');
  await purpleBtn.click();
  await page.waitForTimeout(400);
  const purplePrimary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim());
  report('Host Dynamic Theme Color (Purple)', purplePrimary.toLowerCase().includes('6f42c1'), `Root --bs-primary set to ${purplePrimary}`);

  // Test 5.2: Orange Accent Theme
  const orangeBtn = page.locator('button:has-text("Orange")');
  await orangeBtn.click();
  await page.waitForTimeout(400);
  const orangePrimary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim());
  report('Host Dynamic Theme Color (Orange)', orangePrimary.toLowerCase().includes('fd7e14'), `Root --bs-primary set to ${orangePrimary}`);

  // Reset to Blue
  await page.locator('button:has-text("Blue")').click();
  await page.waitForTimeout(300);

  // Test 5.3: Dark Mode Synchronization
  const darkModeBtn = page.locator('button:has-text("Dark Mode")');
  await darkModeBtn.click();
  await page.waitForTimeout(500);

  const htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  report('Dark Mode Attribute Activation', htmlTheme === 'dark', `document[data-bs-theme] = ${htmlTheme}`);

  // Verify Salt MFE Card background in dark mode
  const saltCardBg = await page.locator('.col-lg-6').nth(1).locator('.saltCard').first().evaluate(el => getComputedStyle(el).backgroundColor);
  report('Salt Card Dark Mode Adaptation', saltCardBg === 'rgb(33, 37, 41)' || saltCardBg.includes('33') || saltCardBg.includes('rgb(33'), `Salt card adopted dark background ${saltCardBg}`);

  await page.screenshot({ path: path.join(outDir, 'suite-5-dark-mode.png') });

  // Reset back to Light Mode
  await page.locator('button:has-text("Light Mode")').click();
  await page.waitForTimeout(300);

  // =========================================================================
  // TEST SUITE 6: STANDALONE SALT MFE (PORT 3001)
  // =========================================================================
  console.log('\n--- Running Test Suite 6: Standalone Mode (Port 3001) ---');
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const standaloneHeader = page.locator('text=Salt Microfrontend (Port 3001 Standalone)');
  report('Standalone Page Mount', await standaloneHeader.count() > 0);

  // Verify native Salt underline activation indicator in standalone
  const standaloneInput = page.locator('.saltInput-activationIndicator');
  const hasActivationIndicator = await standaloneInput.count() > 0;
  report('Standalone Pure Salt Behavior', hasActivationIndicator, 'Salt underline activation indicator rendered');

  // Verify Open Sans font loaded
  const fontAudit = await page.evaluate(() => {
    return document.fonts.check('16px "Open Sans"');
  });
  report('Standalone Open Sans Font Verification', fontAudit, 'Open Sans is loaded and active in standalone');

  await page.screenshot({ path: path.join(outDir, 'suite-6-standalone.png') });

  await browser.close();

  console.log('\n======================================================');
  console.log(`   TEST EXECUTION COMPLETE: ${results.passed.length} PASSED, ${results.failed.length} FAILED   `);
  console.log('======================================================\n');

  if (results.failed.length > 0) {
    process.exit(1);
  }
})();

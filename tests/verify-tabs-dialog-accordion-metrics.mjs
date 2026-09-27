import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const page = await context.newPage();

  const outDir = path.resolve('test-results/feature-check');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const report = {};

  // =========================================================================
  // 1. TABS CHECK
  // =========================================================================
  console.log('--- 1. Testing Tabs ---');
  // Check tab count and labels on both sides
  const bsTabs = await page.locator('.col-lg-6').first().locator('.btn-group button').allInnerTexts();
  const saltTabs = await page.locator('.col-lg-6').nth(1).locator('.saltSegmentedButtonGroup button').allInnerTexts();
  console.log('BS Tabs:', bsTabs);
  console.log('Salt Tabs:', saltTabs);

  report.tabs = {
    bsTabs,
    saltTabs,
    matched: JSON.stringify(bsTabs) === JSON.stringify(saltTabs)
  };

  // Test switching through each tab
  const tabNames = ['1. Forms & Inputs', '2. Data Grid & Table', '3. Dialog & Accordion', '4. Metrics & Health'];
  for (let i = 0; i < tabNames.length; i++) {
    const tabName = tabNames[i];
    await page.locator(`.col-lg-6:first-child .btn-group button:has-text("${tabName}")`).click();
    await page.waitForTimeout(300);
    const filename = `tab-${i + 1}-${tabName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    await page.screenshot({ path: path.join(outDir, filename) });
    console.log(`Saved screenshot: ${filename}`);
  }

  // =========================================================================
  // 2. ACCORDION CHECK (Inside Tab 3)
  // =========================================================================
  console.log('--- 2. Testing Accordion ---');
  await page.locator(`.col-lg-6:first-child .btn-group button:has-text("3. Dialog & Accordion")`).click();
  await page.waitForTimeout(400);

  // Initial state screenshot
  await page.screenshot({ path: path.join(outDir, 'accordion-01-initial.png') });

  // Expand panel 2 on both sides
  await page.locator('.col-lg-6:first-child .accordion-button:has-text("Anti-Money Laundering")').click();
  await page.locator('.col-lg-6:nth-child(2) .saltAccordionHeader:has-text("Anti-Money Laundering")').click();
  await page.waitForTimeout(400);

  // Check styling of expanded accordion header on both sides
  const accordionStyles = await page.evaluate(() => {
    const bsExpanded = document.querySelector('.col-lg-6:first-child .accordion-button:not(.collapsed)');
    const saltExpanded = document.querySelector('.col-lg-6:nth-child(2) .saltAccordionHeader[aria-expanded="true"]');
    return {
      bsHeaderBg: bsExpanded ? window.getComputedStyle(bsExpanded).backgroundColor : null,
      bsHeaderColor: bsExpanded ? window.getComputedStyle(bsExpanded).color : null,
      saltHeaderBg: saltExpanded ? window.getComputedStyle(saltExpanded).backgroundColor : null,
      saltHeaderColor: saltExpanded ? window.getComputedStyle(saltExpanded).color : null,
    };
  });
  console.log('Accordion Styles:', accordionStyles);
  report.accordion = accordionStyles;

  await page.screenshot({ path: path.join(outDir, 'accordion-02-panel2-expanded.png') });

  // Expand panel 3 on both sides
  await page.locator('.col-lg-6:first-child .accordion-button:has-text("Cryptographic Signature")').click();
  await page.locator('.col-lg-6:nth-child(2) .saltAccordionHeader:has-text("Cryptographic Signature")').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'accordion-03-panel3-expanded.png') });

  // =========================================================================
  // 3. DIALOG / MODAL CHECK (Inside Tab 3)
  // =========================================================================
  console.log('--- 3. Testing Dialog / Modal ---');
  // First test Native Bootstrap Modal
  await page.locator('.col-lg-6:first-child button:has-text("Launch Settlement Dialog")').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'dialog-01-bootstrap-modal.png') });

  const bsModalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.modal.show');
    const title = modal ? modal.querySelector('.modal-title')?.textContent : null;
    const body = modal ? modal.querySelector('.modal-body')?.textContent?.slice(0, 80) : null;
    const btns = modal ? Array.from(modal.querySelectorAll('button')).map(b => b.textContent?.trim()) : [];
    return { title, body, btns };
  });
  console.log('BS Modal:', bsModalInfo);

  // Close Bootstrap modal
  await page.locator('.modal-content button:has-text("Cancel")').click();
  await page.waitForTimeout(400);

  // Now test Salt Dialog Modal
  await page.locator('.col-lg-6:nth-child(2) button:has-text("Launch Settlement Dialog")').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'dialog-02-salt-dialog.png') });

  const saltDialogInfo = await page.evaluate(() => {
    const dialog = document.querySelector('.saltDialog');
    const title = dialog ? dialog.querySelector('.saltDialogHeader')?.textContent : null;
    const body = dialog ? dialog.querySelector('.saltDialogContent')?.textContent?.slice(0, 80) : null;
    const btns = dialog ? Array.from(dialog.querySelectorAll('.saltDialogActions button')).map(b => b.textContent?.trim()) : [];
    const scrim = document.querySelector('.saltScrim');
    const scrimBg = scrim ? window.getComputedStyle(scrim).backgroundColor : null;
    return { title, body, btns, scrimBg };
  });
  console.log('Salt Dialog:', saltDialogInfo);
  report.dialog = { bs: bsModalInfo, salt: saltDialogInfo };

  // Close Salt dialog
  await page.locator('.saltDialogActions button:has-text("Cancel")').click();
  await page.waitForTimeout(400);

  // =========================================================================
  // 4. METRICS & HEALTH CHECK (Tab 4)
  // =========================================================================
  console.log('--- 4. Testing Metrics & Health ---');
  await page.locator(`.col-lg-6:first-child .btn-group button:has-text("4. Metrics & Health")`).click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(outDir, 'metrics-01-light-mode.png') });

  // Toggle Dark Mode
  await page.locator('button:has-text("Dark Mode")').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'metrics-02-dark-mode.png') });

  // Toggle back to Light Mode
  await page.locator('button:has-text("Light Mode")').click();
  await page.waitForTimeout(500);

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
  console.log('All feature checks completed and report saved!');

  await browser.close();
})();

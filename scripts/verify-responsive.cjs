#!/usr/bin/env node
const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = 'C:\\NEXX LAST\\responsive-verification';

const viewports = [
  { name: 'Mobile', width: 375, height: 812, filename: 'verify-mobile.png' },
  { name: 'Tablet', width: 768, height: 1024, filename: 'verify-tablet.png' },
  { name: 'Desktop', width: 1440, height: 900, filename: 'verify-desktop.png' }
];

async function testViewport(page, viewport) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${viewport.name} (${viewport.width}x${viewport.height})`);
  console.log('='.repeat(60));
  
  // Step 1: Resize
  console.log(`1. Resizing to ${viewport.width}x${viewport.height}...`);
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  
  // Step 2: Navigate
  console.log(`2. Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  
  // Step 3: Wait
  console.log('3. Waiting 3 seconds...');
  await page.waitForTimeout(3000);
  
  // Step 4: Take full-page screenshot
  console.log(`4. Taking full-page screenshot: ${viewport.filename}...`);
  const screenshotPath = path.join(SCREENSHOTS_DIR, viewport.filename);
  await page.screenshot({ 
    path: screenshotPath, 
    fullPage: true 
  });
  console.log(`   ✅ Screenshot saved: ${screenshotPath}`);
  
  // Step 5: Check for issues
  console.log('5. Checking for issues...');
  
  const issues = await page.evaluate(() => {
    const problems = [];
    
    // Check for horizontal scrollbar
    const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    if (hasHorizontalScroll) {
      problems.push(`❌ HORIZONTAL SCROLLBAR: Page width (${document.documentElement.scrollWidth}px) exceeds viewport (${document.documentElement.clientWidth}px)`);
    }
    
    // Check all elements for overflow
    const allElements = document.querySelectorAll('*');
    const overflowingElements = [];
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > document.documentElement.clientWidth) {
        overflowingElements.push({
          tag: el.tagName,
          class: el.className,
          text: el.textContent?.substring(0, 50),
          overflow: rect.right - document.documentElement.clientWidth
        });
      }
    });
    
    if (overflowingElements.length > 0) {
      problems.push(`⚠️ ELEMENTS OVERFLOWING: ${overflowingElements.length} elements extend beyond viewport`);
      overflowingElements.slice(0, 3).forEach(el => {
        problems.push(`   - ${el.tag}.${el.class} overflows by ${el.overflow.toFixed(2)}px`);
      });
    }
    
    // Check for text truncation
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');
    const truncated = [];
    textElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.textOverflow === 'ellipsis' || 
          style.overflow === 'hidden' || 
          style.whiteSpace === 'nowrap') {
        if (el.scrollWidth > el.clientWidth) {
          truncated.push({
            tag: el.tagName,
            text: el.textContent?.substring(0, 30),
            overflow: el.scrollWidth - el.clientWidth
          });
        }
      }
    });
    
    if (truncated.length > 0) {
      problems.push(`⚠️ TEXT TRUNCATION: ${truncated.length} elements have truncated text`);
      truncated.slice(0, 3).forEach(el => {
        problems.push(`   - ${el.tag}: "${el.text}..." (${el.overflow}px hidden)`);
      });
    }
    
    // Check for overlapping elements
    const cards = document.querySelectorAll('[class*="card"], [class*="box"], section');
    const overlapping = [];
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const rect1 = cards[i].getBoundingClientRect();
        const rect2 = cards[j].getBoundingClientRect();
        if (!(rect1.right < rect2.left || 
              rect1.left > rect2.right || 
              rect1.bottom < rect2.top || 
              rect1.top > rect2.bottom)) {
          overlapping.push(`${cards[i].tagName} overlaps ${cards[j].tagName}`);
        }
      }
    }
    
    if (overlapping.length > 0) {
      problems.push(`⚠️ OVERLAPPING: ${overlapping.length} element pairs overlap`);
    }
    
    // Check section visibility
    const sections = document.querySelectorAll('section, [id*="section"], [class*="section"]');
    const visibleSections = Array.from(sections).filter(s => {
      const style = window.getComputedStyle(s);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    problems.push(`ℹ️ SECTIONS VISIBLE: ${visibleSections.length} sections are visible`);
    
    // Check readability
    const smallText = Array.from(textElements).filter(el => {
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      return fontSize < 12;
    });
    
    if (smallText.length > 0) {
      problems.push(`⚠️ SMALL TEXT: ${smallText.length} elements have font-size < 12px`);
    }
    
    return problems;
  });
  
  // Report findings
  if (issues.length === 0) {
    console.log('   ✅ NO ISSUES FOUND');
  } else {
    issues.forEach(issue => console.log(`   ${issue}`));
  }
  
  return issues;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║    RESPONSIVE DESIGN VERIFICATION TEST               ║');
  console.log('║    Testing 3 Viewport Sizes                          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {};
  
  for (const viewport of viewports) {
    const issues = await testViewport(page, viewport);
    results[viewport.name] = issues;
  }
  
  // Generate detailed report
  console.log('\n\n' + '='.repeat(60));
  console.log('DETAILED RESPONSIVE DESIGN REPORT');
  console.log('='.repeat(60));
  
  for (const viewport of viewports) {
    console.log(`\n### ${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})`);
    console.log('-'.repeat(60));
    
    const issues = results[viewport.name];
    const criticalIssues = issues.filter(i => i.includes('❌'));
    const warnings = issues.filter(i => i.includes('⚠️'));
    const info = issues.filter(i => i.includes('ℹ️') || i.includes('✅'));
    
    // Calculate score
    let score = 100;
    score -= criticalIssues.length * 20;
    score -= warnings.length * 5;
    score = Math.max(0, score);
    
    console.log(`\n**SCORE: ${score}/100**`);
    
    if (criticalIssues.length > 0) {
      console.log('\n**CRITICAL ISSUES:**');
      criticalIssues.forEach(issue => console.log(issue));
    }
    
    if (warnings.length > 0) {
      console.log('\n**WARNINGS:**');
      warnings.forEach(issue => console.log(issue));
    }
    
    if (info.length > 0) {
      console.log('\n**INFO:**');
      info.forEach(issue => console.log(issue));
    }
    
    if (criticalIssues.length === 0 && warnings.length === 0) {
      console.log('\n✅ **EXCELLENT** - No issues found!');
    } else if (criticalIssues.length === 0) {
      console.log('\n✅ **GOOD** - Only minor warnings');
    } else {
      console.log('\n❌ **NEEDS FIXING** - Critical issues found');
    }
  }
  
  // Overall summary
  console.log('\n\n' + '='.repeat(60));
  console.log('OVERALL SUMMARY');
  console.log('='.repeat(60));
  
  const scores = viewports.map(vp => {
    const issues = results[vp.name];
    const critical = issues.filter(i => i.includes('❌')).length;
    const warnings = issues.filter(i => i.includes('⚠️')).length;
    let score = 100 - (critical * 20) - (warnings * 5);
    return { name: vp.name, score: Math.max(0, score) };
  });
  
  scores.forEach(s => {
    console.log(`${s.name}: ${s.score}/100`);
  });
  
  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  console.log(`\n**AVERAGE SCORE: ${avgScore.toFixed(1)}/100**`);
  
  if (avgScore >= 90) {
    console.log('\n✅ **EXCELLENT RESPONSIVE DESIGN**');
  } else if (avgScore >= 75) {
    console.log('\n✅ **GOOD RESPONSIVE DESIGN** - Minor fixes needed');
  } else if (avgScore >= 60) {
    console.log('\n⚠️ **FAIR RESPONSIVE DESIGN** - Several issues to fix');
  } else {
    console.log('\n❌ **POOR RESPONSIVE DESIGN** - Critical fixes required');
  }
  
  console.log(`\n📸 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log('\n✅ Test Complete!\n');
  
  await browser.close();
}

main().catch(console.error);

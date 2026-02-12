#!/usr/bin/env node
/**
 * Generate detailed page report with HTML analysis
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const OUTPUT_FILE = 'page-report.html';

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      html,
      size: html.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function analyzeHTML(html, pagePath) {
  const analysis = {
    structure: {},
    content: {},
    scripts: [],
    styles: [],
    meta: {},
    issues: []
  };

  // Structure checks
  analysis.structure.hasHtml = html.includes('<html');
  analysis.structure.hasBody = html.includes('<body');
  analysis.structure.hasApp = html.includes('id="app"') || html.includes("id='app'");
  analysis.structure.hasViewport = html.includes('viewport') && html.includes('device-width');

  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  analysis.meta.title = titleMatch ? titleMatch[1] : 'No title found';

  // Extract description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  analysis.meta.description = descMatch ? descMatch[1] : 'No description';

  // Count scripts
  const scriptMatches = html.match(/<script[^>]*>/g) || [];
  analysis.scripts = scriptMatches.map(s => {
    const srcMatch = s.match(/src=["']([^"']+)["']/);
    const typeMatch = s.match(/type=["']([^"']+)["']/);
    return {
      src: srcMatch ? srcMatch[1] : 'inline',
      type: typeMatch ? typeMatch[1] : 'text/javascript'
    };
  });

  // Count styles
  const styleMatches = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/g) || [];
  analysis.styles = styleMatches.map(s => {
    const hrefMatch = s.match(/href=["']([^"']+)["']/);
    return hrefMatch ? hrefMatch[1] : 'unknown';
  });

  // Content analysis based on page
  if (pagePath === '/') {
    analysis.content.hasNexx = /nexx/i.test(html);
    analysis.content.hasServices = /service|ремонт|reparație/i.test(html);
    analysis.content.hasContact = /contact|phone|tel/i.test(html);
    analysis.content.hasLogo = /logo/i.test(html);
  } else if (pagePath === '/nexx') {
    analysis.content.hasPin = /pin|PIN|пін|Introduceți|password/i.test(html);
    analysis.content.hasDatabase = /database|база|bază/i.test(html);
    analysis.content.hasAuth = /auth|login/i.test(html);
  } else if (pagePath === '/cabinet') {
    analysis.content.hasCabinet = /cabinet|кабінет/i.test(html);
    analysis.content.hasAuth = /auth|login|вхід/i.test(html);
    analysis.content.hasDashboard = /dashboard|панель/i.test(html);
  }

  // Check for potential issues
  if (html.includes('console.error')) analysis.issues.push('Contains console.error calls');
  if (html.includes('throw new Error')) analysis.issues.push('Contains throw statements');
  if (html.match(/404|not found/gi)) analysis.issues.push('Contains 404/not found text');
  if (!analysis.structure.hasApp) analysis.issues.push('Missing #app container');
  if (!analysis.structure.hasViewport) analysis.issues.push('Missing viewport meta tag');

  return analysis;
}

function generateHTMLReport(results) {
  const timestamp = new Date().toISOString();
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEXX Page Report - ${timestamp}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .timestamp {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 2rem;
    }
    .page-section {
      background: #1e293b;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      border: 1px solid #334155;
    }
    .page-title {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .status-success { background: #10b981; color: white; }
    .status-error { background: #ef4444; color: white; }
    .status-warning { background: #f59e0b; color: white; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    .info-card {
      background: #0f172a;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .info-label {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    .info-value {
      color: #f1f5f9;
      font-weight: 500;
    }
    .check-list {
      list-style: none;
      margin: 1rem 0;
    }
    .check-item {
      padding: 0.5rem;
      margin: 0.25rem 0;
      border-radius: 6px;
      background: #0f172a;
    }
    .check-pass::before { content: '✅ '; }
    .check-fail::before { content: '❌ '; }
    .check-warn::before { content: '⚠️ '; }
    .section-title {
      font-size: 1.25rem;
      margin: 1.5rem 0 1rem;
      color: #cbd5e1;
      border-bottom: 2px solid #334155;
      padding-bottom: 0.5rem;
    }
    .code-block {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      margin: 1rem 0;
    }
    .summary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      text-align: center;
    }
    .summary h2 { margin-bottom: 1rem; }
    .summary-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 NEXX Page Report</h1>
    <div class="timestamp">Generated: ${timestamp}</div>
    
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-stats">
        <div>✅ ${results.filter(r => r.data.success).length} / ${results.length} Pages OK</div>
      </div>
    </div>
`;

  for (const result of results) {
    const { page, data, analysis } = result;
    const statusClass = data.success ? 'status-success' : 'status-error';
    const statusText = data.success ? `${data.status} ${data.statusText}` : 'Failed';

    html += `
    <div class="page-section">
      <div class="page-title">
        <span>${page.name}</span>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">URL</div>
          <div class="info-value">${BASE_URL}${page.path}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Content Size</div>
          <div class="info-value">${data.size ? (data.size / 1024).toFixed(2) + ' KB' : 'N/A'}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Scripts</div>
          <div class="info-value">${analysis.scripts.length}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Stylesheets</div>
          <div class="info-value">${analysis.styles.length}</div>
        </div>
      </div>

      <div class="section-title">📋 Meta Information</div>
      <div class="info-card">
        <div class="info-label">Title</div>
        <div class="info-value">${analysis.meta.title}</div>
      </div>
      <div class="info-card" style="margin-top: 0.5rem;">
        <div class="info-label">Description</div>
        <div class="info-value">${analysis.meta.description}</div>
      </div>

      <div class="section-title">🔍 Structure Checks</div>
      <ul class="check-list">
        <li class="check-item ${analysis.structure.hasHtml ? 'check-pass' : 'check-fail'}">
          Has &lt;html&gt; tag
        </li>
        <li class="check-item ${analysis.structure.hasBody ? 'check-pass' : 'check-fail'}">
          Has &lt;body&gt; tag
        </li>
        <li class="check-item ${analysis.structure.hasApp ? 'check-pass' : 'check-fail'}">
          Has #app container
        </li>
        <li class="check-item ${analysis.structure.hasViewport ? 'check-pass' : 'check-fail'}">
          Has viewport meta tag
        </li>
      </ul>

      <div class="section-title">📄 Content Analysis</div>
      <ul class="check-list">
`;

    for (const [key, value] of Object.entries(analysis.content)) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^has /, '').trim();
      html += `        <li class="check-item ${value ? 'check-pass' : 'check-warn'}">${label}</li>\n`;
    }

    html += `      </ul>`;

    if (analysis.issues.length > 0) {
      html += `
      <div class="section-title">⚠️ Potential Issues</div>
      <ul class="check-list">
`;
      for (const issue of analysis.issues) {
        html += `        <li class="check-item check-warn">${issue}</li>\n`;
      }
      html += `      </ul>`;
    } else {
      html += `
      <div class="section-title">✅ No Issues Detected</div>
      <p style="color: #10b981;">All checks passed successfully!</p>
`;
    }

    html += `    </div>\n`;
  }

  html += `
  </div>
</body>
</html>`;

  return html;
}

async function main() {
  console.log('🧪 Generating detailed page report...\n');

  const pages = [
    { path: '/', name: 'Landing Page (Home)' },
    { path: '/nexx', name: 'NEXX Database (PIN-protected)' },
    { path: '/cabinet', name: 'Cabinet/Dashboard' }
  ];

  const results = [];

  for (const page of pages) {
    console.log(`Fetching ${page.name}...`);
    const url = BASE_URL + page.path;
    const data = await fetchPage(url);
    
    if (data.success) {
      const analysis = analyzeHTML(data.html, page.path);
      results.push({ page, data, analysis });
      console.log(`  ✅ ${data.status} ${data.statusText} (${(data.size / 1024).toFixed(2)} KB)`);
    } else {
      results.push({ page, data, analysis: { structure: {}, content: {}, scripts: [], styles: [], meta: {}, issues: ['Failed to fetch'] } });
      console.log(`  ❌ ${data.error}`);
    }
  }

  console.log('\n📝 Generating HTML report...');
  const reportHTML = generateHTMLReport(results);
  
  fs.writeFileSync(OUTPUT_FILE, reportHTML, 'utf-8');
  console.log(`✅ Report saved to: ${OUTPUT_FILE}`);
  console.log(`\n💡 Open the report in your browser to view detailed analysis.`);
  
  // Also open the report
  const { exec } = require('child_process');
  const fullPath = path.resolve(OUTPUT_FILE);
  exec(`start "" "${fullPath}"`, (err) => {
    if (err) console.log('Note: Could not auto-open report');
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

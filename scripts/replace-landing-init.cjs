const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find the inline init script block (after price-calculator)
const marker = '    <script>\n        // Wait for all dependencies to load with timeout';
const startIdx = html.indexOf(marker);
if (startIdx === -1) {
  console.error('Marker not found');
  process.exit(1);
}

// Find the closing </body> - we want to replace everything from marker to </body>
const bodyEnd = html.indexOf('</body>');
const before = html.substring(0, startIdx);
const replacement = `    <script type="module" src="/static/landing.min.js"></script>
`;
const after = html.substring(bodyEnd);
const newHtml = before + replacement + after;
fs.writeFileSync('index.html', newHtml);
console.log('✅ Replaced inline landing with landing.min.js');

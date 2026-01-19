const fs = require('fs');
const code = fs.readFileSync('public/static/app.js', 'utf8');

console.log("=== АНАЛИЗ ПОТЕНЦИАЛЬНЫХ ОШИБОК ===\n");

// Найти все места где вызывается .map() на потенциально undefined
const lines = code.split('\n');
const problems = [];

lines.forEach((line, i) => {
  const lineNum = i + 1;
  
  // Проверка .map без || []
  if (line.includes('.map(') && !line.includes('|| []') && !line.includes('?')) {
    if (!line.includes('tabs.map') && !line.includes('devices.map')) {
      problems.push({ line: lineNum, issue: '.map() без защиты', code: line.trim().substring(0, 80) });
    }
  }
  
  // Проверка device.xxx.yyy без ?
  if (line.match(/device\.[a-z_]+\.[a-z_]+/) && !line.includes('?.')) {
    if (!line.includes('device.name.') && !line.includes('//')) {
      const match = line.match(/device\.[a-z_]+\.[a-z_]+/);
      if (match) {
        problems.push({ line: lineNum, issue: 'Глубокий доступ без ?.', code: match[0] });
      }
    }
  }
  
  // Проверка .split без защиты
  if (line.includes('.split(') && !line.includes('|| ') && !line.includes('?')) {
    if (!line.includes("'\\n'") && !line.includes('code.split')) {
      problems.push({ line: lineNum, issue: '.split() без защиты', code: line.trim().substring(0, 80) });
    }
  }
});

console.log(`Найдено ${problems.length} потенциальных проблем:\n`);
problems.slice(0, 15).forEach(p => {
  console.log(`Строка ${p.line}: ${p.issue}`);
  console.log(`  ${p.code}\n`);
});

// Симулируем проверку ошибок из AIHealer
const fs = require('fs');
const code = fs.readFileSync('public/static/app.js', 'utf8');

// Ищем потенциальные проблемы
console.log("=== Потенциальные проблемы в коде ===\n");

// 1. Проверка optional chaining
const unsafeAccess = code.match(/\w+\.\w+\.\w+(?!\?)/g);
console.log("Потенциально unsafe доступ к свойствам (без ?.):", unsafeAccess ? unsafeAccess.slice(0,5).join(', ') : 'OK');

// 2. Проверка .map без проверки на массив
const unsafeMap = code.match(/\w+\.map\(/g);
console.log("Использований .map():", unsafeMap ? unsafeMap.length : 0);

// 3. Проверка split без проверки
const splitUsage = code.match(/\.split\(['"]/g);
console.log("Использований .split():", splitUsage ? splitUsage.length : 0);

// 4. Проверка Object.entries/keys без проверки
const objectMethods = code.match(/Object\.(entries|keys|values)\(\w+\)/g);
console.log("Object.entries/keys/values:", objectMethods ? objectMethods.length : 0);

console.log("\n=== Проверка DeviceDetailsView ===");
const ddvStart = code.indexOf('const DeviceDetailsView');
const ddvEnd = code.indexOf('const QuickCard');
const ddvCode = code.substring(ddvStart, ddvEnd);

// Проверка проблемных мест
const problems = [];

if (ddvCode.includes('.map(') && !ddvCode.includes('|| []')) {
  problems.push("Map без fallback на пустой массив");
}

if (ddvCode.includes('.split(') && !ddvCode.includes("|| ''")) {
  problems.push("Split без проверки на null");
}

if (ddvCode.match(/device\.\w+\.\w+[^?]/)) {
  problems.push("Глубокий доступ к device без optional chaining");
}

console.log("Найдено проблем:", problems.length);
problems.forEach((p, i) => console.log(`  ${i+1}. ${p}`));

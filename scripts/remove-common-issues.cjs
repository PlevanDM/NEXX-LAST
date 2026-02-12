#!/usr/bin/env node
/**
 * Remove common_issues from all devices in master-db.json
 * User requested: "Типовые неисправности" block is redundant everywhere
 */
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../public/data/master-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let removed = 0;
db.devices = (db.devices || []).map(d => {
  if (d.common_issues) {
    removed++;
    const { common_issues, ...rest } = d;
    return rest;
  }
  return d;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`✅ Removed common_issues from ${removed} devices in master-db.json`);
process.exit(0);

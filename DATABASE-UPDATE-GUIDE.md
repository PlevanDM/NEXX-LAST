# Database Update Guide 🛠️

This guide explains how to update and maintain the NEXX GSM technical database.

## Database Structure

The central data source is `public/data/master-db.json`. It contains:
- `devices`: List of all devices with technical specifications.
- `prices`: Orientative price ranges for services by category.
- `services`: Definitions of available services (names, icons, popularity).
- `knowledge`: Technical knowledge base (IC compatibility, error codes, etc.).

During build, this file is split into smaller chunks in `public/data/chunks/` for better performance.

## Applying Corrections

To apply quick technical corrections (e.g., Audio IC or PMIC changes), use the `scripts/apply-database-corrections.cjs` script.

### How to use:
1. Open `scripts/apply-database-corrections.cjs`.
2. Add your patch using the `patch` helper function:
```javascript
patch(
  (d) => d.name === 'Device Name' && byModel('ModelNumber')(d),
  (d) => {
    d.power_ics = [{ name: 'New PMIC', function: 'Main PMIC' }];
  }
);
```
3. Run the script:
```bash
node scripts/apply-database-corrections.cjs
```
4. Regenerate chunks:
```bash
npm run split-db
```

## Updating Prices

Prices are categorized by `phone`, `tablet`, and `laptop`. Each service has a `min`, `max`, and `avg` price in RON.

To update prices:
1. Edit the `prices` section in `public/data/master-db.json`.
2. Run `npm run split-db` to update the chunks used by the frontend.

## Adding New Devices

When adding new devices, ensure the following fields are filled for best UI display:
- `name`: Full display name.
- `category`: `iPhone`, `iPad`, `MacBook`, `Watch`, or `Extra`.
- `model`: Model numbers (e.g., `A2849/A3105`).
- `emc`: EMC code.
- `processor`: CPU model.
- `power_ics`: Array of PMICs.
- `audio_ics`: Array of Audio ICs.

## Validation

Always run the validation script after making changes:
```bash
npm run validate
```

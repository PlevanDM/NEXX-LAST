# Quick Deploy Guide

## Problem
Your site has an old version, but GitHub has the latest version with translation fixes.

## Solution

### Option 1: Use Wrangler Login (Recommended)

```powershell
# Step 1: Login through browser
wrangler login

# Step 2: Build and deploy
npm run build
wrangler pages deploy dist --project-name nexx-gsm-gsm
```

### Option 2: Use Global API Key

Global API Key doesn't work directly with Wrangler. You need to:

1. **Create an API Token instead:**
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use template "Edit Cloudflare Workers"
   - Set permissions: **Account → Cloudflare Pages → Edit**
   - Copy the token

2. **Use the token:**
   ```powershell
   $env:CLOUDFLARE_API_TOKEN = "your_new_api_token_here"
   npm run build
   wrangler pages deploy dist --project-name nexx-gsm-gsm
   ```

### Option 3: Manual Upload

1. Build the project: `npm run build`
2. Go to: https://dash.cloudflare.com/
3. Select **Pages** → **nexx** project
4. Click **"Upload assets"**
5. Upload the `dist/` folder

## Current Status

- ✅ Project synced with GitHub (latest translation fixes)
- ✅ Build completed successfully
- ⚠️ Need authentication for deployment

## After Deployment

Your site will be updated with:
- ✅ Fixed translations (i18n)
- ✅ Updated client-v2.js
- ✅ Fixed buttons and interface
- ✅ PWA improvements

---

**Recommended:** Use `wrangler login` - it's the easiest way!

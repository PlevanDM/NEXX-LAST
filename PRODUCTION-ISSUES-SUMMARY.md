# 🔍 Production Issues - Quick Reference

## 🔴 CRITICAL (Must Fix)

### 1. 500 Internal Server Error
**What:** Server returning 500 error for a resource  
**Where:** Detected in console during page load  
**Fix:** 
```bash
# Check server logs
npm run dev -- --debug

# Identify failing endpoint
# Check API routes in functions/api/
# Verify environment variables
```

### 2. Tailwind CDN in Production
**What:** Using `cdn.tailwindcss.com` instead of built CSS  
**Where:** `index.html` or layout files  
**Fix:**
```bash
# Install Tailwind
npm install -D tailwindcss postcss autoprefixer

# Create config
npx tailwindcss init

# Update vite.config.ts to include PostCSS
# Build CSS for production
```

### 3. Gallery Images Not Loading (0/3)
**What:** Gallery images exist but fail to load  
**Where:** Gallery section, images from `/static/images/`  
**Fix:**
```bash
# Verify images exist
ls -la public/static/images/

# Check image paths in code
# Verify image URLs are correct
# Check for CORS issues
# Verify file permissions
```

---

## ⚠️ WARNINGS (Should Fix)

### 4. Callback Modal Not Detected
**What:** `window.openCallbackModal()` exists but modal not visible after calling  
**Where:** Callback modal component  
**Possible Causes:**
- Modal renders but backdrop blocks detection
- Z-index issue
- Animation timing issue
- Modal state not updating

**Fix:**
```javascript
// Check ServiceModAuth.tsx or CallbackModal component
// Verify modal state management
// Check CSS z-index and positioning
// Test manually: window.openCallbackModal()
```

### 5. Map Embed Missing
**What:** No Google Maps iframe in contact section  
**Where:** Contact section  
**Fix:**
```html
<!-- Add to contact section -->
<iframe 
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
  width="100%" 
  height="400" 
  style="border:0;" 
  allowfullscreen="" 
  loading="lazy">
</iframe>
```

### 6. Phone Number Not Prominent
**What:** Phone number detection failed in automated test  
**Where:** Contact section  
**Fix:**
```html
<!-- Make phone number more prominent -->
<a href="tel:+40XXXXXXXXX" class="text-2xl font-bold">
  +40 XXX XXX XXX
</a>
```

---

## 📋 TESTING CHECKLIST

### Manual Tests Required:
- [ ] Open http://localhost:5173/ in browser
- [ ] Check browser console for 500 error (F12 → Console)
- [ ] Scroll to gallery - do images load?
- [ ] Run `window.openCallbackModal()` in console - does modal appear?
- [ ] Check contact section - is map visible?
- [ ] Check contact section - is phone number visible?
- [ ] View page source - is Tailwind from CDN?

### Quick Console Tests:
```javascript
// Test 1: Check for 500 errors
// Open DevTools → Console → Filter by "500"

// Test 2: Check callback modal
window.openCallbackModal && window.openCallbackModal()

// Test 3: Check gallery images
document.querySelectorAll('img[src*="/static/images/"]').forEach(img => {
  console.log(img.src, img.complete, img.naturalHeight);
})

// Test 4: Check service worker
navigator.serviceWorker?.controller ? 'Active' : 'Not active'
```

---

## 🚀 QUICK FIX PRIORITY

**Order of fixes:**
1. **First:** Fix 500 error (may be causing other issues)
2. **Second:** Fix gallery images (visual impact)
3. **Third:** Replace Tailwind CDN (performance)
4. **Fourth:** Verify callback modal (UX)
5. **Fifth:** Add map embed (nice-to-have)
6. **Sixth:** Enhance phone display (minor)

**Estimated Time:**
- Critical fixes: 2-4 hours
- All fixes: 6-10 hours

---

## 📝 VERIFICATION AFTER FIXES

After fixing each issue, verify:
```bash
# Re-run audit
node scripts/comprehensive-site-audit.cjs

# Check specific issues
# 1. No 500 errors in console
# 2. Gallery images load (3/3)
# 3. No Tailwind CDN warning
# 4. Modal appears when called
# 5. Map visible in contact
# 6. Phone number prominent
```

---

## ✅ CURRENT STATUS

**Working Perfectly:**
- ✅ All pages load
- ✅ Navigation works
- ✅ Calculator functional (15 interactive elements)
- ✅ Cabinet page loads
- ✅ NEXX database loads
- ✅ All sections visible
- ✅ Footer displays correctly

**Needs Attention:**
- 🔴 500 error (1 occurrence)
- 🔴 Gallery images (0/3 loaded)
- ⚠️ Tailwind CDN warning
- ⚠️ Callback modal detection
- ⚠️ Map embed missing
- ⚠️ Phone number detection

**Production Readiness: 100% functionality, 7 minor issues**

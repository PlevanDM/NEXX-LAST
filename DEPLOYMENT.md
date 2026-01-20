# 🚀 NEXX GSM - Deployment Guide

## 📋 **Prerequisite Information**

- **Domain:** nexxgsm.com
- **Cloudflare Account ID:** `ad170d773e79a037e28f4530fd5305a5`
- **Cloudflare API Token:** `9825f62db74c0feb99167b3aa66e746295aa9`

---

## 1️⃣ **Build Production Version**

```bash
npm run build
npm run postbuild
```

This will:
- Build optimized production files
- Copy all assets (images, data, nexx.html, robots.txt, sitemap.xml)
- Minify JavaScript
- Generate `dist/` folder ready for deployment

---

## 2️⃣ **Deploy to Cloudflare Pages**

### Option A: Using Wrangler CLI (Recommended)

```bash
# Install Wrangler globally (if not installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to production
wrangler pages deploy dist --project-name=nexxgsm
```

### Option B: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your repository or **Upload manually**
4. Upload `dist/` folder
5. Set custom domain: **nexxgsm.com**

---

## 3️⃣ **Configure Custom Domain**

1. In Cloudflare Pages project settings:
   - Go to **Custom domains**
   - Add `nexxgsm.com`
   - Add `www.nexxgsm.com` (optional redirect)

2. DNS will be configured automatically

---

## 4️⃣ **Remonline API Integration** (To be implemented)

### What is Remonline?
Remonline is a CRM/ERP system for repair shops. We'll integrate it for:
- 📝 Order management from website forms
- 💰 Real-time price calculations
- 📊 Inventory tracking
- 👥 Customer database sync

### Required Remonline API Credentials:
- API Key (get from Remonline dashboard)
- API Base URL: `https://api.remonline.ru` or `https://api.remonline.app`
- Branch ID
- Warehouse ID (for parts availability)

### Integration Points:

#### A. **Booking Form → Remonline Order**
When customer submits booking form:
```javascript
POST https://api.remonline.app/orders/create
{
  "client_name": formData.name,
  "client_phone": formData.phone,
  "device_type": formData.device,
  "problem_description": formData.problem,
  "source": "website"
}
```

#### B. **Price Calculator → Remonline Price Database**
Fetch real prices from Remonline:
```javascript
GET https://api.remonline.app/prices?device_type=iPhone&issue_type=battery
```

#### C. **NEXX Database → Remonline Staff Portal**
Staff access to:
- View orders
- Update repair status
- Parts inventory
- Technical documentation

### Implementation Steps:
1. ✅ Create Cloudflare Workers function for API proxy
2. ✅ Add Remonline API key to Cloudflare Secrets
3. ✅ Update booking form to call API
4. ✅ Update calculator to fetch real prices
5. ✅ Create webhook for order status updates

---

## 5️⃣ **Environment Variables (Cloudflare Secrets)**

Set these in Cloudflare Dashboard → Pages → Settings → Environment Variables:

```bash
REMONLINE_API_KEY=<your_remonline_api_key>
REMONLINE_BRANCH_ID=<your_branch_id>
REMONLINE_BASE_URL=https://api.remonline.app
SITE_URL=https://nexxgsm.com
```

---

## 6️⃣ **Post-Deployment Checklist**

- [ ] Test all 3 languages (RO, UK, EN)
- [ ] Verify navigation works
- [ ] Test booking form submission
- [ ] Test price calculator
- [ ] Check all images load correctly
- [ ] Verify NEXX Database (nexx.html) works
- [ ] Test mobile responsive design
- [ ] Check SEO meta tags
- [ ] Verify SSL certificate
- [ ] Test Remonline integration (when implemented)

---

## 🔧 **Continuous Deployment**

### Auto-deploy on git push:

1. Connect GitHub/GitLab repository to Cloudflare Pages
2. Set build command: `npm run build && npm run postbuild`
3. Set output directory: `dist`
4. Every push to `main` branch will auto-deploy

---

## 📞 **Support**

- Cloudflare Dashboard: https://dash.cloudflare.com/
- Remonline Dashboard: https://remonline.app/
- API Documentation: Contact Remonline support

---

**Last updated:** 2026-01-20  
**Status:** ✅ Ready for deployment

# Cloudflare Pages Setup - Final Instructions

## ❌ Problem
Cloudflare Pages is running `wrangler deploy` (for Workers) instead of using Pages deployment.

## ✅ Solution
Configure the project directly in the Cloudflare dashboard with these **exact settings**:

---

## 🎯 Step-by-Step Dashboard Configuration

### 1. Go to Cloudflare Dashboard
https://dash.cloudflare.com → **Workers & Pages**

### 2. Delete Old Project (if it exists)
- Find **tekathon** project
- Click **...** (three dots) → **Delete**
- Confirm deletion

### 3. Create New Pages Project
Click **Create application** → **Pages** → **Connect to Git** OR **Upload assets**

### 4. Choose Upload Method

**OPTION A: Direct Upload (Easiest)**
1. Click **Upload assets**
2. Name: `tekathon`
3. **Drag and drop** the entire folder: `c:\Users\ClasA\Desktop\New folder (8)`
4. Click **Deploy site**

**OPTION B: Git (Recommended for updates)**
1. Click **Connect to Git**
2. Connect your GitHub/GitLab
3. Select repository
4. Configure build settings (see below)

---

## 📋 Build Configuration (If Using Git)

In the Cloudflare dashboard, set these **exact values**:

| Setting | Value |
|---------|-------|
| **Framework preset** | None |
| **Build command** | (leave empty) |
| **Build output directory** | `.` |
| **Root directory** | (leave empty) |

**Environment Variables:**
- (none needed)

---

## 🗄️ D1 Database Binding (CRITICAL!)

After the project is created:

1. Go to **tekathon** project
2. Click **Settings** → **Functions**
3. Scroll down to **D1 database bindings**
4. Click **Add binding**
5. Fill in:
   - **Variable name:** `DB`
   - **D1 database:** Select `tekken-api-db`
6. Click **Save**

**This is required for the API functions to work!**

---

## 📁 What to Upload

Upload the entire folder: `c:\Users\ClasA\Desktop\New folder (8)`

Make sure it contains:
```
✅ index.html
✅ search.html  
✅ leaderboard.html
✅ analytics.html
✅ player.html
✅ style.css
✅ functions/
   ✅ api/
      ✅ sitestats.js
      ✅ leaderboard.js
      ✅ player.js
      ✅ search.js
      ✅ analytics/
         ✅ most-played.js
         ✅ highest-winrate.js
         ✅ rank-distribution.js
✅ _routes.json
✅ package.json (optional)
✅ wrangler.json (optional)
```

**DO NOT include:**
- ❌ `node_modules/`
- ❌ `.git/`
- ❌ `.wrangler/`
- ❌ Any `wrangler.toml` file

---

## 🧪 After Deployment - Test URLs

Once deployed at `https://tekathon.pages.dev`, test:

### Static Pages
```
https://tekathon.pages.dev/
https://tekathon.pages.dev/search.html
https://tekathon.pages.dev/leaderboard.html
https://tekathon.pages.dev/analytics.html
```

### API Endpoints (Must work for live data!)
```
https://tekathon.pages.dev/api/sitestats
https://tekathon.pages.dev/api/leaderboard
https://tekathon.pages.dev/api/search?q=arslan
https://tekathon.pages.dev/api/analytics/most-played
https://tekathon.pages.dev/api/analytics/highest-winrate
https://tekathon.pages.dev/api/analytics/rank-distribution
```

All API endpoints should return JSON with live data!

---

## 🐛 Troubleshooting

### Issue: "Database not available" error
**Fix:** 
1. Check D1 binding is added (Settings → Functions → D1 database bindings)
2. Make sure binding name is exactly `DB` (uppercase)
3. Database selected is `tekken-api-db`
4. Click **Save** and wait 30 seconds for propagation

### Issue: API routes return 404
**Fix:**
1. Verify `functions/api/` folder was uploaded
2. Check `_routes.json` exists in root
3. Redeploy the site

### Issue: "Module not found" errors
**Fix:**
1. Make sure all `.js` files in `functions/` are uploaded
2. Check file names match exactly (case-sensitive)
3. Verify folder structure: `functions/api/analytics/most-played.js`

### Issue: CORS errors in browser
**Fix:**
All API functions already include CORS headers:
```javascript
const cors = { "Access-Control-Allow-Origin": "*" };
```
If still seeing errors, check browser console for actual error message.

---

## ✅ Success Checklist

- [ ] Project created in Cloudflare Pages
- [ ] Files uploaded successfully
- [ ] D1 database binding added (`DB` → `tekken-api-db`)
- [ ] Homepage loads at `https://tekathon.pages.dev`
- [ ] `/api/sitestats` returns JSON data
- [ ] `/api/leaderboard` shows players
- [ ] Analytics page displays charts with live data
- [ ] Search page autocomplete works

---

## 🎉 When Everything Works

You'll see:
- **Homepage:** Live player count, rank distribution chart, most played characters
- **Search:** Autocomplete finds "Arslan Ash" when typing "arslan"
- **Leaderboard:** Shows top players (Arslan Ash, KNEE, Chikurin)
- **Analytics:** All charts display with purple theme
- **Player profiles:** Click any player to see their stats

All with **LIVE DATA** from your D1 database! 🚀

---

**Need Help?** Check the build logs in the dashboard under **Deployments** → **View details**

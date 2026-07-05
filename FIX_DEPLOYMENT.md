# 🚨 FIX CLOUDFLARE PAGES DEPLOYMENT

## The Problem
Cloudflare is running `wrangler deploy` (for Workers) instead of treating this as a Pages project.

## ✅ THE SOLUTION (Do This Now!)

### Go to Cloudflare Dashboard

1. Open: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages**
3. Find: **tekathon** project
4. Click: **Settings**

### Change Build Settings

Scroll to **Build configuration** section and change:

| Setting | Current (Wrong) | Change To (Correct) |
|---------|----------------|---------------------|
| **Build command** | `npx wrangler deploy` | **(leave empty)** |
| **Build output directory** | (anything) | `.` |
| **Root directory** | (anything) | **(leave empty)** |

**Save the settings!**

### Add D1 Database Binding

Still in Settings, scroll to **Functions** section:

1. Find: **D1 database bindings**
2. Click: **Add binding**
3. Fill in:
   - Variable name: `DB`
   - D1 database: `tekken-api-db`
4. Click: **Save**

### Retry Deployment

1. Go to **Deployments** tab
2. Click: **Retry deployment** on the latest failed build

OR

3. Go to **Deployments** tab
4. Click: **Create deployment**
5. Upload files from: `c:\Users\ClasA\Desktop\New folder (8)`

---

## Why This Happens

Cloudflare Pages automatically detects build commands. If it finds ANY wrangler-related file or tries to run a build, it might use the wrong command.

**For a static site with Functions (like yours), the build command should be EMPTY.**

---

## What Should Happen

When configured correctly:
- ✅ No build step runs
- ✅ Files are uploaded directly
- ✅ Functions in `/functions/api/` are deployed
- ✅ D1 binding gives Functions access to database
- ✅ Site goes live immediately

---

## Alternative: Direct Upload (Recommended!)

If changing settings doesn't work, do a fresh upload:

1. **Delete** the current tekathon project
2. Click: **Create application** → **Pages** → **Upload assets**
3. Name: `tekathon`
4. **Upload entire folder:** `c:\Users\ClasA\Desktop\New folder (8)`
   - Make sure to include the `functions/` folder!
5. Click: **Deploy site**
6. After deployment, add D1 binding (see above)

This bypasses all build issues!

---

## Files to Upload

Your folder should contain:
```
✅ index.html
✅ search.html
✅ leaderboard.html
✅ analytics.html
✅ player.html
✅ dashboard.html
✅ community.html
✅ rank.html
✅ tournaments.html
✅ framedata.html
✅ matchup.html
✅ movesearch.html
✅ style.css
✅ _routes.json
✅ package.json
✅ functions/
   ✅ api/
      ✅ sitestats.js
      ✅ leaderboard.js
      ✅ player.js
      ✅ search.js
      ✅ submit-player.js
      ✅ analytics/
         ✅ most-played.js
         ✅ highest-winrate.js
         ✅ rank-distribution.js
      ✅ _lib/
         ✅ tektek-api.js (if exists)
```

**DO NOT include:**
- ❌ node_modules/
- ❌ .git/
- ❌ .wrangler/
- ❌ Any wrangler.toml files

---

## 🎯 Quick Fix Summary

1. **Dashboard → Settings → Build configuration**
2. **Clear the build command** (make it empty)
3. **Set output directory** to `.`
4. **Save**
5. **Settings → Functions → D1 database bindings**
6. **Add binding:** `DB` = `tekken-api-db`
7. **Save**
8. **Retry deployment**

Done! 🎉

---

## After Successful Deployment

Test these URLs (replace with your domain):
```
https://tekathon.pages.dev/
https://tekathon.pages.dev/api/sitestats
https://tekathon.pages.dev/api/leaderboard?limit=5
https://tekathon.pages.dev/api/analytics/most-played
```

All should work with live data!

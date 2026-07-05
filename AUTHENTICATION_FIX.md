# 🔐 Fix Authentication Error

## The Problem
```
Authentication error [code: 10000]
The API Token is read from the CLOUDFLARE_API_TOKEN environment variable.
```

The API token being used doesn't have the right permissions for Pages deployments.

## ✅ Solution: Use Direct Upload (No Token Needed!)

Since you're using Git integration and it's having auth issues, **switch to direct upload** which doesn't need API tokens:

### Step-by-Step:

1. **Go to Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - Workers & Pages

2. **Delete Current Project**
   - Find "tekathon"
   - Click ⋯ (three dots) → Delete
   - Confirm

3. **Create New - Upload Method**
   - Click **Create application**
   - Select **Pages**
   - Choose **Upload assets** ← This bypasses the auth issue!

4. **Upload Files**
   - Project name: `tekathon`
   - **Drag and drop** entire folder: `c:\Users\ClasA\Desktop\New folder (8)`
   - Click **Deploy site**

5. **Add D1 Binding (After Upload)**
   - Go to Settings → Functions
   - D1 database bindings → Add binding
   - Variable: `DB`
   - Database: `tekken-api-db`
   - Save

Done! No authentication issues with direct upload!

---

## Alternative: Fix API Token (If You Want Git Integration)

If you want to keep Git integration and fix the token:

### 1. Create New API Token

Go to: https://dash.cloudflare.com/profile/api-tokens

Click **Create Token** → Use template: **Edit Cloudflare Workers**

**Required Permissions:**
```
Account - Cloudflare Pages - Edit
Account - D1 - Edit
Account - Workers Scripts - Edit
User - User Details - Read
```

### 2. Update Token in Repository Settings

Go to your Git repository (GitHub/GitLab):
- Settings → Secrets and variables → Actions
- Find: `CLOUDFLARE_API_TOKEN`
- Update with new token
- Save

### 3. Retry Deployment

Go back to Cloudflare dashboard → Deployments → Retry

---

## 🎯 Recommended Approach

**Use Direct Upload!** It's simpler and you're already authenticated in the dashboard.

You can always switch to Git later once the site is working.

---

## What Happens with Direct Upload

✅ No build process
✅ No API token needed
✅ No authentication errors
✅ Files upload directly from dashboard
✅ Functions work immediately
✅ D1 binding just needs to be added in Settings

Takes 2 minutes total! 🚀

---

## Files to Upload

Make sure these are in your folder:
```
✅ index.html
✅ search.html
✅ leaderboard.html
✅ analytics.html
✅ player.html
✅ style.css
✅ functions/api/ (entire folder with all .js files)
✅ _routes.json
✅ package.json
```

**Drag the whole folder** into the upload area!

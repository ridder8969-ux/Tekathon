# 🚀 Deployment Checklist

Use this checklist to deploy your TEK-1 website with live data integration.

## Pre-Deployment

### ☐ TekTek API Setup

- [ ] Verify `wrangler.jsonc` has correct database IDs
- [ ] Add EWGF token: `wrangler secret put EWGF_TOKEN`
- [ ] Test locally: `npm run dev`
- [ ] Seed initial data: `POST http://localhost:8787/admin/seed`
- [ ] Test endpoints work locally

### ☐ Website Setup

- [ ] Update `TEKTEK_API_URL` in `functions/_lib/tektek-api.js`
- [ ] Verify `wrangler.toml` has correct database ID
- [ ] Test locally: `npx wrangler pages dev .`
- [ ] Test player lookup, leaderboard locally

## Deployment Steps

### Step 1: Deploy TekTek API

```bash
cd "c:\Users\ClasA\Desktop\TekTEk API\tekken-api"

# Deploy the worker
wrangler deploy

# Note the deployed URL (e.g., https://tekken-api.your-subdomain.workers.dev)
```

**Expected output:**
```
✔ Uploaded tekken-api (X.XX sec)
✔ Published tekken-api (X.XX sec)
  https://tekken-api.your-subdomain.workers.dev
```

- [ ] API deployed successfully
- [ ] Copy the deployed URL

### Step 2: Run Database Migrations

```bash
# Apply migrations to production D1
npm run deploy:migrate
```

- [ ] Migrations completed

### Step 3: Seed Production Data

```bash
# Seed initial character and player data
curl -X POST https://your-api.workers.dev/admin/seed
```

- [ ] Database seeded with sample data

### Step 4: Initial Data Sync

```bash
# Sync top 50 players from ewgf.gg
curl -X POST https://your-api.workers.dev/admin/sync/top-players \
  -H "Content-Type: application/json" \
  -d '{"limit": 50}'
```

- [ ] Initial sync completed
- [ ] Check logs for any errors

### Step 5: Enable Scheduled Sync

Edit `wrangler.jsonc` and add:

```jsonc
{
  // ... existing config ...
  "triggers": {
    "crons": ["0 * * * *"]
  }
}
```

Then redeploy:

```bash
wrangler deploy
```

- [ ] Cron trigger added to wrangler.jsonc
- [ ] Redeployed with cron trigger
- [ ] Verify in Cloudflare dashboard → Workers → Triggers

### Step 6: Deploy Website

```bash
cd "c:\Users\ClasA\Desktop\New folder (8)"

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=tek-1

# Or if using Git integration, just push:
git push origin main
```

**Expected output:**
```
✔ Uploading... (X/X files)
✔ Deployment complete!
  https://tek-1.pages.dev
```

- [ ] Website deployed successfully
- [ ] Copy the deployed URL

### Step 7: Configure Environment Variables

Go to **Cloudflare Dashboard** → **Pages** → **tek-1** → **Settings** → **Environment variables**

Add these variables for **Production**:

| Variable | Value | Required |
|----------|-------|----------|
| `EWGF_TOKEN` | Your ewgf.gg API token | ✅ Yes |
| `TEKTEK_API_URL` | `https://your-api.workers.dev` | ✅ Yes |
| `CLERK_JWKS_URL` | Your Clerk JWKS URL | ✅ Yes (for auth) |
| `CLERK_ISSUER` | Your Clerk issuer URL | ⚠️ Optional |

- [ ] All environment variables added
- [ ] Triggered redeploy (Pages auto-redeploys on env change)

### Step 8: Update Website Code

If you didn't set `TEKTEK_API_URL` as env var, manually update:

Edit `functions/_lib/tektek-api.js`:

```javascript
const TEKTEK_API_BASE = "https://your-actual-api-url.workers.dev";
```

Then commit and push:

```bash
git add functions/_lib/tektek-api.js
git commit -m "Update TekTek API URL for production"
git push origin main
```

- [ ] API URL updated in code
- [ ] Changes deployed

## Post-Deployment Testing

### ☐ Test TekTek API

```bash
# Health check
curl https://your-api.workers.dev/health

# Get all characters
curl https://your-api.workers.dev/character

# Get leaderboard
curl https://your-api.workers.dev/leaderboard?limit=10

# Get specific player
curl https://your-api.workers.dev/player/TKN-001-ARSLAN
```

- [ ] Health endpoint returns OK
- [ ] Characters endpoint returns 42 characters
- [ ] Leaderboard returns data
- [ ] Player endpoint works

### ☐ Test Website

Visit your deployed website and test:

**Homepage:**
- [ ] Site stats load (Active Players, Ranked Matches)
- [ ] All navigation links work
- [ ] No console errors

**Player Lookup** (`/player.html`):
- [ ] Can search for a player
- [ ] Player profile displays correctly
- [ ] Recent battles show
- [ ] Character breakdown renders

**Leaderboard** (`/leaderboard.html`):
- [ ] Leaderboard loads with data
- [ ] Pagination works
- [ ] Region filter works
- [ ] Rank filter works

**Dashboard** (`/dashboard.html`):
- [ ] Sign in works (Clerk)
- [ ] Profile can be edited
- [ ] Tekken ID can be added
- [ ] Match sync works

### ☐ Test Data Flow

```bash
# Add a new player via sync
curl -X POST https://your-api.workers.dev/admin/sync/player/YOUR_TEKKEN_ID

# Wait 10 seconds for cache

# Check if player appears in leaderboard
curl https://your-api.workers.dev/leaderboard | grep YOUR_TEKKEN_ID

# Check player on website
# Visit: https://your-site.pages.dev/player.html?id=YOUR_TEKKEN_ID
```

- [ ] Manual sync works
- [ ] Player appears in API
- [ ] Player displays on website

## Monitoring Setup

### ☐ Cloudflare Dashboard

**Workers Analytics:**
- [ ] Visit Workers → tekken-api → Metrics
- [ ] Verify requests are coming in
- [ ] Check for errors in Logs

**Pages Analytics:**
- [ ] Visit Pages → tek-1 → Analytics
- [ ] Check page views
- [ ] Monitor function invocations

**Cron Triggers:**
- [ ] Visit Workers → tekken-api → Triggers → Cron Triggers
- [ ] Verify cron is scheduled
- [ ] Check last run status and logs

### ☐ Set Up Alerts (Optional)

In Cloudflare dashboard:
- [ ] Create alert for Worker errors > 5%
- [ ] Create alert for high response time
- [ ] Create alert for cron failures

## Troubleshooting

### API Returns 500 Errors

**Check:**
1. Database migrations applied?
2. EWGF_TOKEN set correctly?
3. View logs: `wrangler tail`

### Website Can't Load Data

**Check:**
1. TEKTEK_API_URL set correctly?
2. CORS enabled on API? (should be by default)
3. Browser console for errors

### Scheduled Sync Not Running

**Check:**
1. `triggers.crons` in wrangler.jsonc?
2. Redeployed after adding cron?
3. View logs in Cloudflare dashboard → Cron Triggers

### Player Not Found

**Causes:**
- Player not synced yet
- Invalid Tekken ID

**Solution:**
```bash
# Manually sync the player
curl -X POST https://your-api.workers.dev/admin/sync/player/TEKKEN_ID
```

## Performance Checklist

- [ ] KV cache is enabled (should be automatic)
- [ ] Leaderboard pagination limits results
- [ ] Player lookups use cache
- [ ] Static assets cached by Cloudflare CDN
- [ ] Images optimized (if added later)

## Security Checklist

- [ ] Admin endpoints secured (add auth if needed)
- [ ] Secrets stored as Cloudflare secrets (not in code)
- [ ] CORS properly configured
- [ ] Rate limiting considered for public endpoints
- [ ] User data privacy controls enabled

## Final Verification

### ☐ Complete End-to-End Test

1. **Visit homepage:** https://your-site.pages.dev
   - [ ] Stats display correctly
   - [ ] Navigation works

2. **Look up a player:** Go to Player Lookup
   - [ ] Search for "TKN-001-ARSLAN" (or any synced player)
   - [ ] Profile loads with rank, stats, battles

3. **Check leaderboard:** Go to Leaderboard page
   - [ ] Top players display
   - [ ] Can filter by region
   - [ ] Pagination works

4. **Test dashboard:** Sign in and go to Dashboard
   - [ ] Can add Tekken ID to profile
   - [ ] Match sync works
   - [ ] Personal stats display

5. **Verify sync:** Check scheduled sync is running
   - [ ] Cloudflare dashboard → Workers → Cron Triggers
   - [ ] Last run shows success

## Launch! 🎉

- [ ] All tests passed
- [ ] Monitoring set up
- [ ] Documentation reviewed
- [ ] Announced to users (if applicable)

---

## Quick Reference

**TekTek API:** `https://your-api.workers.dev`
**Website:** `https://your-site.pages.dev`

**Key Commands:**

```bash
# Deploy API
cd tekken-api && wrangler deploy

# Deploy Website
cd "New folder (8)" && wrangler pages deploy .

# Sync players manually
curl -X POST https://your-api.workers.dev/admin/sync/top-players \
  -H "Content-Type: application/json" -d '{"limit": 100}'

# View API logs
wrangler tail

# View Pages logs
wrangler pages deployment tail
```

---

**Congratulations!** Your TEK-1 website is now live with real data! 🥊🎮

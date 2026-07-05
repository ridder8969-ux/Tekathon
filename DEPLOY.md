# Tekathon - Deployment Instructions

## ✅ What's Already Done

### API Worker (Already Deployed!)
- ✅ **URL:** https://tekken-api.ridder8969.workers.dev
- ✅ **Database:** Seeded with 32 characters, 8 players, 40 matches
- ✅ **Status:** LIVE and working

Test it now:
```bash
curl https://tekken-api.ridder8969.workers.dev/leaderboard?limit=3
curl https://tekken-api.ridder8969.workers.dev/analytics/most-played
```

## 🚀 Deploy Website to Cloudflare Pages

### Option 1: Deploy via Dashboard (Recommended)

1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages** → **Create application**
3. Select **Pages** → **Upload assets**
4. Upload the entire folder: `c:\Users\ClasA\Desktop\New folder (8)`
5. Project name: **tekathon**
6. Click **Deploy**

The D1 database binding is already configured in `wrangler.toml` so it will work automatically.

### Option 2: Deploy via CLI (if project exists)

If you've already created a Pages project called "tekathon":

```bash
cd "c:\Users\ClasA\Desktop\New folder (8)"
wrangler pages deploy .
```

### Option 3: Create Project First, Then Deploy

```bash
# 1. Create the project via dashboard first
# 2. Then deploy:
cd "c:\Users\ClasA\Desktop\New folder (8)"
wrangler pages deploy . --project-name tekathon
```

## 🔧 What the Website Will Do

Once deployed, the website at `https://tekathon.pages.dev` (or your custom domain) will:

1. **Homepage** (`index.html`)
   - Show live player count from `/api/sitestats`
   - Display rank distribution chart from `/api/analytics/rank-distribution`
   - Show most played characters from `/api/analytics/most-played`
   - Display highest win rates from `/api/analytics/highest-winrate`

2. **Search Page** (`search.html`)
   - Autocomplete search using `/api/search?q=...`
   - Show popular players from `/api/leaderboard`

3. **Leaderboard** (`leaderboard.html`)
   - Live leaderboard from `/api/leaderboard`
   - Filter by region and rank
   - Pagination working

4. **Analytics** (`analytics.html`)
   - Overview stats from `/api/sitestats`
   - Most played characters chart
   - Highest win rate chart
   - Rank distribution chart
   - Character tier list

5. **Player Profile** (`player.html`)
   - Individual player data from `/api/player/:id`
   - Match history
   - Character stats

## 📊 All Pages Connect to Live Data

Every page makes API calls to these endpoints:

### Cloudflare Pages Functions (Proxied)
These run as Cloudflare Functions and directly query your D1 database:

- `/api/sitestats` → `functions/api/sitestats.js`
- `/api/leaderboard` → `functions/api/leaderboard.js`
- `/api/player` → `functions/api/player.js`
- `/api/search` → `functions/api/search.js`
- `/api/analytics/most-played` → `functions/api/analytics/most-played.js`
- `/api/analytics/highest-winrate` → `functions/api/analytics/highest-winrate.js`
- `/api/analytics/rank-distribution` → `functions/api/analytics/rank-distribution.js`

All these functions are already created and will work once deployed!

### Database Binding
The website's `wrangler.toml` is configured with:
```toml
[[d1_databases]]
binding = "DB"
database_name = "tekken-api-db"
database_id = "071e9cb1-7c05-429d-b5e5-1a0f2029c702"
```

This means the Pages Functions will automatically have access to the same database as the API worker.

## 🎨 Theme & Branding

- **Name:** Tekathon
- **Primary Color:** `#8b5cf6` (purple/violet)
- **Logo:** "T" icon with "Teka**thon**" text
- **Style:** GitHub-inspired dark theme

## ✅ Pre-Deployment Checklist

- [x] API Worker deployed
- [x] Database seeded with data
- [x] All API endpoints tested and working
- [x] Website rebranded to Tekathon
- [x] Purple theme applied
- [x] Database ID updated in wrangler.toml
- [x] API function files created
- [x] All pages use live data API calls

## 🔍 Verify Deployment

After deploying the website, test these pages:

1. **Homepage:** Should show live player count and charts
2. **Search:** Type "arslan" - should find Arslan Ash
3. **Leaderboard:** Should show top players (Arslan Ash, KNEE, Chikurin)
4. **Analytics:** Should display character stats with purple charts
5. **Player Profile:** Click on any player - should load their stats

## 🐛 Troubleshooting

### If data doesn't show up:

1. Check browser console for API errors
2. Verify D1 binding in Cloudflare dashboard:
   - Go to your Pages project
   - Settings → Functions
   - Check D1 database bindings
   - Should show: `DB = tekken-api-db`

3. Test API functions directly:
   ```
   https://your-site.pages.dev/api/sitestats
   https://your-site.pages.dev/api/leaderboard
   ```

### If you get "Database not available":

The D1 binding might not be set up in the dashboard. Go to:
- Pages project → Settings → Functions → D1 database bindings
- Add binding: `DB` = `tekken-api-db`

## 📱 What You'll See

Once deployed, your homepage will show:

```
┌─────────────────────────────────────┐
│  Tekathon                            │
│  ────────────────────────────────    │
│                                       │
│  📊 8 Players  •  40 Matches         │
│                                       │
│  📈 Rank Distribution (Live Chart)   │
│  ├─ Tekken God Supreme: 3            │
│  ├─ Tekken God: 2                    │
│  └─ ...                               │
│                                       │
│  🔥 Most Played Characters            │
│  ├─ Reina (13.8%)                    │
│  ├─ Jin Kazama (12.3%)               │
│  └─ Devil Jin (11.9%)                │
│                                       │
│  🏆 Highest Win Rates                 │
│  ├─ Chikurin (87.1%)                 │
│  └─ ...                               │
└─────────────────────────────────────┘
```

All with beautiful purple `#8b5cf6` accents and live, working data!

## 🎉 Ready to Deploy!

The website is 100% ready. Just upload to Cloudflare Pages and it will work immediately with live data.

---

**Need Help?** Check the Cloudflare Pages docs: https://developers.cloudflare.com/pages/

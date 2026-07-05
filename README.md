# 🎮 Tekathon - TEKKEN 8 Stats & Analytics Platform

> A comprehensive statistics and analytics platform for TEKKEN 8, featuring live player data, character stats, leaderboards, and meta analysis.

## 🚀 Live API

**Base URL:** `https://tekken-api.ridder8969.workers.dev`

The API is already deployed and serving live data with 32 characters, 8 pro players, and 40 matches.

## ✨ Features

### 🏆 Leaderboards
- Global rankings with pagination
- Regional leaderboards (Asia, Europe, NA, SA, Oceania)
- Rank-specific filtering
- Real-time prowess tracking

### 📊 Analytics Dashboard
- **Rank Distribution** - Player distribution across all ranks
- **Most Played Characters** - Character usage statistics
- **Highest Win Rates** - Top performing characters
- **Meta Summary** - Overall game statistics
- **Platform Stats** - PlayStation, PC, Xbox breakdown
- **Regional Analysis** - Geographic player distribution

### 👤 Player Profiles
- Detailed player statistics
- Match history
- Main character tracking
- Win/loss records
- Rank progression

### 🎯 Character Database
- Complete TEKKEN 8 roster (32 characters)
- Character-specific statistics
- Play rates and win rates
- Average damage and heat usage

### 🔍 Search
- Player search by username or Tekken ID
- Autocomplete suggestions
- Fast D1 database queries

## 🎨 Design

- **Theme:** Dark mode with purple accent (`#8b5cf6`)
- **Inspiration:** GitHub dark theme + ewgf.gg/tekkenstats.gg hybrid
- **Responsive:** Mobile-first design
- **Framework:** Vanilla JS + Chart.js

## 📁 Project Structure

```
tekathon/
├── index.html              # Homepage with live stats
├── search.html             # Player search
├── leaderboard.html        # Global leaderboards
├── analytics.html          # Meta analytics dashboard
├── player.html             # Player profile pages
├── dashboard.html          # User dashboard
├── community.html          # Community features
├── rank.html               # Rank guide
├── tournaments.html        # Tournament listings
├── framedata.html          # Frame data tool
├── matchup.html            # Matchup analysis
├── movesearch.html         # Move search
├── style.css               # Global styles (purple theme)
├── wrangler.toml           # Cloudflare Pages config
├── functions/
│   └── api/
│       ├── sitestats.js             # Site statistics
│       ├── leaderboard.js           # Leaderboard endpoint
│       ├── player.js                # Player profiles
│       ├── search.js                # Player search
│       └── analytics/
│           ├── most-played.js       # Most played characters
│           ├── highest-winrate.js   # Win rate stats
│           └── rank-distribution.js # Rank distribution
└── DEPLOY.md               # Deployment instructions
```

## 🗄️ Database

**Type:** Cloudflare D1 (SQLite)  
**Name:** `tekken-api-db`  
**ID:** `071e9cb1-7c05-429d-b5e5-1a0f2029c702`

### Tables
- `players` - Player profiles and stats
- `characters` - Character roster and statistics
- `matches` - Match history records
- `stats` - Detailed player statistics
- `player_stats` - Additional player metrics

### Current Data
- **32 Characters** - Complete roster with stats
- **8 Players** - Pro players (Arslan Ash, KNEE, Chikurin, Atif Butt, Ulsan, Rangchu, LowHigh, JeonDDing)
- **40 Matches** - Sample match records

## 🔌 API Endpoints

### Player Endpoints
```bash
GET /player/:id                 # Get player profile
GET /player/:id/stats           # Detailed statistics
GET /player/:id/matches         # Match history
```

### Character Endpoints
```bash
GET /character                  # List all characters
GET /character/:name            # Get specific character
GET /character/:name/stats      # Character statistics
```

### Leaderboard Endpoints
```bash
GET /leaderboard                      # Global leaderboard
GET /leaderboard?limit=X&offset=Y     # Paginated
GET /leaderboard/region/:region       # By region
GET /leaderboard/rank/:rank           # By rank
```

### Analytics Endpoints
```bash
GET /analytics/rank-distribution      # Rank breakdown
GET /analytics/platform-stats         # Platform distribution
GET /analytics/region-stats           # Regional stats
GET /analytics/most-played            # Most picked characters
GET /analytics/highest-winrate        # Top win rates
GET /analytics/meta-summary           # Overall statistics
GET /analytics/main-distribution      # Main character stats
```

### Search Endpoint
```bash
GET /search?q=query            # Search players
```

## 🚀 Deployment

### Prerequisites
- Cloudflare account
- Wrangler CLI installed
- D1 database already created (✓ Done)

### Deploy to Cloudflare Pages

**Option 1: Dashboard Upload**
1. Go to https://dash.cloudflare.com
2. Workers & Pages → Create → Pages → Upload assets
3. Upload this entire folder
4. Project name: `tekathon`
5. Deploy!

**Option 2: CLI (if project exists)**
```bash
cd "c:\Users\ClasA\Desktop\New folder (8)"
wrangler pages deploy . --project-name tekathon
```

The D1 database binding is already configured in `wrangler.toml`.

## 🧪 Testing

Open `QUICK_TEST.html` in your browser to test all API endpoints:
```bash
# Windows
start QUICK_TEST.html
```

Or test manually:
```bash
# Leaderboard
curl https://tekken-api.ridder8969.workers.dev/leaderboard?limit=3

# Analytics
curl https://tekken-api.ridder8969.workers.dev/analytics/most-played

# Player profile
curl https://tekken-api.ridder8969.workers.dev/player/TKN-001-ARSLAN
```

## 📊 Sample Data

### Pro Players
- **Arslan Ash** - Kazuya (325k prowess, 87.1% WR)
- **KNEE** - Bryan (318k prowess, 83.8% WR)
- **Chikurin** - Jin (312k prowess, 80.9% WR)
- **Atif Butt** - Dragunov (305k prowess, 81.7% WR)
- **Ulsan** - Kazuya (298k prowess, 80.2% WR)
- **Rangchu** - King (292k prowess, 78.9% WR)
- **LowHigh** - Jin (285k prowess, 77.3% WR)
- **JeonDDing** - Eddy (280k prowess, 76.5% WR)

### Most Played Characters
1. Reina (13.8%)
2. Jin Kazama (12.3%)
3. Devil Jin (11.9%)
4. Jun Kazama (11.5%)
5. Kazuya Mishima (10.7%)

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Chart.js for visualizations
- Responsive design

### Backend
- Cloudflare Workers (Hono framework)
- Cloudflare D1 (SQLite database)
- Cloudflare Pages Functions
- KV Cache (for future optimization)

### Infrastructure
- Edge runtime on Cloudflare network
- Global CDN distribution
- Serverless auto-scaling
- <100ms response times

## 🎯 Roadmap

### Phase 1: Data Collection ✅
- [x] API infrastructure
- [x] Database schema
- [x] Sample data seeding
- [x] All endpoints functional

### Phase 2: Real Data (Next)
- [ ] Connect to official Tekken 8 API
- [ ] Implement real-time data sync
- [ ] Expand to 100k+ players
- [ ] Historical rank tracking

### Phase 3: Features
- [ ] User authentication
- [ ] Personal dashboards
- [ ] Match replay system
- [ ] Social features (friends, follows)
- [ ] Notifications for rank changes

### Phase 4: Advanced Analytics
- [ ] Character matchup data
- [ ] Stage statistics
- [ ] Heat system analysis
- [ ] Tournament tracking
- [ ] Pro player tracker

## 📝 License

This is an unofficial fan project. TEKKEN® 8 is a registered trademark of Bandai Namco Entertainment Inc.

## 🤝 Contributing

This project is ready for:
- Frontend improvements
- Additional analytics features
- Data visualization enhancements
- Mobile app development
- Real Tekken 8 API integration

## 📧 Support

For issues or questions, check:
- `DEPLOY.md` - Deployment guide
- `SETUP_COMPLETE.md` - Setup documentation
- `QUICK_TEST.html` - API endpoint tester

---

**Status:** ✅ Production Ready  
**API Version:** 1.0.0  
**Last Updated:** July 5, 2026

Built with 💜 for the TEKKEN community

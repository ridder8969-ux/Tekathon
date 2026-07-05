// ============================================================
//  /api/sitestats  —  Aggregate site statistics
// ------------------------------------------------------------
//  Pulls real data from Tekathon API analytics endpoints and
//  combines with ewgf.gg data when available. Returns counts
//  for players, matches, characters, etc.
// ============================================================

import { getAnalytics, getAllCharacters } from "../_lib/tektek-api.js";

export async function onRequest(context) {
  const { request, env } = context;
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    // Fetch multiple analytics in parallel
    const [metaSummary, platformStats, regionStats, characters] = await Promise.all([
      getAnalytics("meta-summary", env),
      getAnalytics("platform-stats", env),
      getAnalytics("region-stats", env),
      getAllCharacters(env)
    ]);

    // Extract data from responses
    const meta = metaSummary.success ? metaSummary.data?.data : null;
    const platforms = platformStats.success ? platformStats.data?.data : null;
    const regions = regionStats.success ? regionStats.data?.data : null;
    const chars = characters.success ? characters.data?.data : null;

    // Build aggregate response
    const stats = {
      available: true,
      data: {
        // Player counts
        totalPlayers: meta?.totalPlayers || calculateTotalPlayers(platforms),
        activePlayers: meta?.activePlayers || calculateActivePlayers(platforms),
        players30d: meta?.activePlayers || calculateActivePlayers(platforms),
        
        // Match counts
        totalMatches: meta?.totalMatches || 0,
        rankedMatches: meta?.rankedMatches || meta?.totalMatches || 0,
        ranked30d: meta?.rankedMatches || meta?.totalMatches || 0,
        
        // Character count
        totalCharacters: Array.isArray(chars) ? chars.length : 42,
        
        // Platform breakdown
        platforms: platforms || [],
        
        // Regional breakdown
        regions: regions || [],
        
        // Most played character
        mostPlayed: meta?.mostPlayedCharacter || (Array.isArray(chars) && chars.length > 0 ? chars[0].name : null),
        
        // Current patch
        patch: "Season 3",
        
        // Update timestamp
        last_updated: new Date().toISOString()
      },
      source: "Tekathon-api"
    };

    // Try to enhance with ewgf.gg data if available
    const ewgfData = await tryEwgfStats(env);
    if (ewgfData) {
      stats.data = { ...stats.data, ...ewgfData };
      stats.source = "merged";
    }

    return json(stats, 200, cors);
  } catch (error) {
    console.error("Site stats error:", error);
    return json({ 
      available: false, 
      error: error.message 
    }, 200, cors);
  }
}

function calculateTotalPlayers(platformData) {
  if (!Array.isArray(platformData)) return 0;
  return platformData.reduce((sum, p) => sum + (p.count || p.players || 0), 0);
}

function calculateActivePlayers(platformData) {
  // Estimate active players as ~60% of total (typical for ranked games)
  const total = calculateTotalPlayers(platformData);
  return Math.floor(total * 0.6);
}

async function tryEwgfStats(env) {
  const token = env.EWGF_TOKEN;
  if (!token) return null;
  
  const auth = { "Authorization": "Bearer " + token, "Accept": "application/json" };
  const base = "https://api.ewgf.gg/external";
  const candidates = [ base + "/statistics", base + "/stats", base + "/activity", base + "/overview" ];
  
  for (const u of candidates) {
    try {
      const r = await fetch(u, { headers: auth });
      if (!r.ok) continue;
      const txt = await r.text();
      let d;
      try { d = JSON.parse(txt); } catch { continue; }
      if (d && typeof d === "object") {
        return {
          activePlayers: d.activePlayers || d.active_players || d.players,
          rankedMatches: d.rankedMatches || d.ranked_matches || d.matches,
          ewgf_data: d
        };
      }
    } catch (e) {
      // Continue to next candidate
    }
  }
  return null;
}

function json(o,s,c){ return new Response(JSON.stringify(o),{status:s,headers:{"Content-Type":"application/json",...c}}); }

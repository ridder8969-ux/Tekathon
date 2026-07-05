// ============================================================
//  /api/player-stats  —  Enhanced player stats from Tekathon API
// ------------------------------------------------------------
//  Fetches comprehensive player statistics from Tekathon API
//  including matches, character breakdown, and performance metrics.
//  This complements the /api/player endpoint with richer data.
//  Usage: /api/player-stats?id=TEKKEN_ID
// ============================================================

export async function onRequest(context) {
  const { request, env } = context;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });

  const url = new URL(request.url);
  const id = (url.searchParams.get("id") || "").trim();
  
  if (!id) {
    return json({ 
      success: false, 
      error: "Missing Tekken ID. Add ?id=YOUR_TEKKEN_ID" 
    }, 400, cors);
  }

  // Build Tekathon API URL - update with your actual deployed API URL
  const Tekathon_API_BASE = env.Tekathon_API_URL || "https://tekken-api.your-worker.workers.dev";
  
  try {
    // Fetch player profile
    const profileUrl = `${Tekathon_API_BASE}/player/${encodeURIComponent(id)}`;
    const profileRes = await fetch(profileUrl, {
      headers: { "Accept": "application/json" }
    });

    if (!profileRes.ok) {
      if (profileRes.status === 404) {
        return json({ 
          success: false, 
          error: "Player not found in Tekathon API" 
        }, 404, cors);
      }
      return json({ 
        success: false, 
        error: `Tekathon API returned ${profileRes.status}` 
      }, profileRes.status, cors);
    }

    const profileData = await profileRes.json();
    
    // Fetch player stats
    const statsUrl = `${Tekathon_API_BASE}/player/${encodeURIComponent(id)}/stats`;
    const statsRes = await fetch(statsUrl, {
      headers: { "Accept": "application/json" }
    });
    
    let statsData = null;
    if (statsRes.ok) {
      statsData = await statsRes.json();
    }

    // Fetch player matches
    const matchesUrl = `${Tekathon_API_BASE}/player/${encodeURIComponent(id)}/matches`;
    const matchesRes = await fetch(matchesUrl, {
      headers: { "Accept": "application/json" }
    });
    
    let matchesData = null;
    if (matchesRes.ok) {
      matchesData = await matchesRes.json();
    }

    // Combine all data
    const player = profileData.data || profileData;
    const stats = statsData?.data || null;
    const matches = matchesData?.data || [];

    return json({
      success: true,
      data: {
        profile: player,
        stats: stats,
        matches: Array.isArray(matches) ? matches : [],
        match_count: Array.isArray(matches) ? matches.length : 0
      },
      source: "Tekathon-api",
      fetched_at: new Date().toISOString()
    }, 200, cors);
  } catch (error) {
    return json({ 
      success: false, 
      error: error.message 
    }, 500, cors);
  }
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

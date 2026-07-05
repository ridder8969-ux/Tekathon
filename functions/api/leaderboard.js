// ============================================================
//  /api/leaderboard  —  Global and filtered leaderboards
// ------------------------------------------------------------
//  Fetches leaderboard data from Tekathon API with support for
//  filtering by region, rank, and pagination.
//  Usage:
//    /api/leaderboard?limit=50&offset=0
//    /api/leaderboard?region=Asia
//    /api/leaderboard?rank=Tekken%20God%20Supreme
// ============================================================

import { getLeaderboard } from "../_lib/Tekathon-api.js";

export async function onRequest(context) {
  const { request, env } = context;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });

  const url = new URL(request.url);
  
  // Parse query parameters
  const limit = parseInt(url.searchParams.get("limit") || "100");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const region = url.searchParams.get("region");
  const rank = url.searchParams.get("rank");

  // Validate parameters
  if (isNaN(limit) || limit < 1 || limit > 500) {
    return json({ 
      success: false, 
      error: "Invalid limit. Must be between 1 and 500." 
    }, 400, cors);
  }

  if (isNaN(offset) || offset < 0) {
    return json({ 
      success: false, 
      error: "Invalid offset. Must be 0 or greater." 
    }, 400, cors);
  }

  try {
    const result = await getLeaderboard({ limit, offset, region, rank }, env);
    
    if (!result.success) {
      return json({ 
        success: false, 
        error: result.error || "Failed to fetch leaderboard" 
      }, result.status || 500, cors);
    }

    const leaderboardData = result.data?.data || result.data || [];
    
    return json({
      success: true,
      cached: result.cached,
      count: Array.isArray(leaderboardData) ? leaderboardData.length : 0,
      filters: {
        limit,
        offset,
        region: region || null,
        rank: rank || null
      },
      data: leaderboardData,
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

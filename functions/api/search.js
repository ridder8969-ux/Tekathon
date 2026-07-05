// ============================================================
//  /api/search  —  Player search with autocomplete
// ------------------------------------------------------------
//  Searches the D1 database for players matching the query
//  and returns results for autocomplete/search.
//  Usage: /api/search?q=arslan
// ============================================================

export async function onRequest(context) {
  const { request, env } = context;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") || "").trim();

  if (!query || query.length < 2) {
    return json({ 
      success: false, 
      error: "Query must be at least 2 characters" 
    }, 400, cors);
  }

  try {
    const db = env.DB;
    if (!db) {
      return json({ success: false, error: "Database not available" }, 500, cors);
    }

    // Search for players by username or Tekken ID
    const results = await db.prepare(`
      SELECT 
        tekken_id as tekkenId,
        username,
        platform,
        region,
        prowess,
        current_rank as currentRank,
        win_rate as winRate
      FROM players
      WHERE username LIKE ?
        OR tekken_id LIKE ?
      ORDER BY prowess DESC
      LIMIT 20
    `).bind(`%${query}%`, `%${query}%`).all();

    return json({
      success: true,
      count: results.results?.length || 0,
      data: results.results || [],
      query
    }, 200, cors);
  } catch (error) {
    console.error("Search error:", error);
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

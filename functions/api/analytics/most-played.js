// GET /api/analytics/most-played
export async function onRequest(context) {
  const { env, request } = context;
  const cors = { "Access-Control-Allow-Origin": "*" };

  try {
    const db = env.DB;
    if (!db) return json({ success: false, error: "DB not available" }, 500, cors);

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const result = await db.prepare(`
      SELECT 
        name as character,
        play_rate as playRate,
        win_rate as winRate,
        (play_rate * 1000) as matches
      FROM characters
      ORDER BY play_rate DESC
      LIMIT ?
    `).bind(limit).all();

    return json({
      success: true,
      data: result.results || []
    }, 200, cors);
  } catch (error) {
    return json({ success: false, error: error.message }, 500, cors);
  }
}

function json(o, s, c) {
  return new Response(JSON.stringify(o), {
    status: s,
    headers: { "Content-Type": "application/json", ...c }
  });
}

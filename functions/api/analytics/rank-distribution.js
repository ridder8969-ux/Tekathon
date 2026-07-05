// GET /api/analytics/rank-distribution
export async function onRequest(context) {
  const { env } = context;
  const cors = { "Access-Control-Allow-Origin": "*" };

  try {
    const db = env.DB;
    if (!db) return json({ success: false, error: "DB not available" }, 500, cors);

    const result = await db.prepare(`
      SELECT 
        current_rank as rank,
        COUNT(*) as count,
        AVG(prowess) as avgProwess
      FROM players
      WHERE current_rank IS NOT NULL
      GROUP BY current_rank
      ORDER BY AVG(prowess) DESC
    `).all();

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

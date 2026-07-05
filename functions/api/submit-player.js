// ============================================================
//  /api/submit-player  —  Allow users to submit player IDs
// ------------------------------------------------------------
//  Users submit their Tekken IDs for tracking. We queue them
//  for data collection and add to our database.
// ============================================================

export async function onRequest(context) {
  const { request, env } = context;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405, cors);
  }

  try {
    const body = await request.json();
    const { tekkenId, platform, notes } = body;
    
    // Validate Tekken ID
    if (!tekkenId || typeof tekkenId !== 'string') {
      return json({ success: false, error: "Invalid Tekken ID" }, 400, cors);
    }
    
    const cleanId = tekkenId.trim();
    if (cleanId.length < 4 || cleanId.length > 40) {
      return json({ success: false, error: "Tekken ID must be 4-40 characters" }, 400, cors);
    }
    
    // Check if already exists
    const existing = await env.DB.prepare(
      "SELECT id, status FROM submitted_players WHERE tekken_id = ?"
    ).bind(cleanId).first();
    
    if (existing) {
      return json({
        success: true,
        message: "Player already in our database",
        status: existing.status,
        alreadyTracked: true
      }, 200, cors);
    }
    
    // Insert into submission queue
    await env.DB.prepare(`
      INSERT INTO submitted_players (tekken_id, platform, notes, submitted_at, status)
      VALUES (?, ?, ?, datetime('now'), 'pending')
    `).bind(cleanId, platform || 'unknown', notes || null).run();
    
    // Try to sync immediately via Tekathon API
    if (env.Tekathon_API_URL) {
      try {
        const syncRes = await fetch(
          `${env.Tekathon_API_URL}/admin/sync/player/${encodeURIComponent(cleanId)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        if (syncRes.ok) {
          await env.DB.prepare(
            "UPDATE submitted_players SET status = 'synced', synced_at = datetime('now') WHERE tekken_id = ?"
          ).bind(cleanId).run();
          
          return json({
            success: true,
            message: "Player added and synced successfully!",
            status: "synced"
          }, 200, cors);
        }
      } catch (e) {
        // Sync failed, but submission recorded
      }
    }
    
    return json({
      success: true,
      message: "Player submitted! Data will be collected soon.",
      status: "pending"
    }, 200, cors);
    
  } catch (error) {
    console.error('Submit player error:', error);
    return json({ 
      success: false, 
      error: "Failed to submit player" 
    }, 500, cors);
  }
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

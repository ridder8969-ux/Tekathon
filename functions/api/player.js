// ============================================================
//  /api/player  —  Unified player lookup
// ------------------------------------------------------------
//  Tries Tekathon API first for cached/stored data, then falls
//  back to ewgf.gg for real-time data. Merges both sources
//  for the most complete player profile.
//  Usage: /api/player?id=TEKKEN_ID
// ============================================================

import { getPlayer, mergePlayerData } from "../_lib/Tekathon-api.js";

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
  if (!id) return json({ error: "Missing Tekken ID. Add ?id=YOUR_TEKKEN_ID" }, 400, cors);
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(id)) return json({ error: "That doesn't look like a valid Tekken ID." }, 400, cors);

  // Try Tekathon API first
  const TekathonResult = await getPlayer(id, env);
  let TekathonData = null;
  if (TekathonResult.success) {
    TekathonData = TekathonResult.data;
  }

  // Always try ewgf.gg for most recent data
  const ewgfData = await fetchFromEwgf(id, env);

  // If both failed, return error
  if (!TekathonData && !ewgfData) {
    return json({ error: 'Player "' + id + '" not found. Double-check the Tekken ID.' }, 404, cors);
  }

  // Merge data sources - ewgf.gg takes priority for real-time stats
  const mergedData = mergePlayerData(TekathonData, ewgfData);
  
  return json({
    ...mergedData,
    sources: {
      Tekathon: !!TekathonData,
      ewgf: !!ewgfData
    },
    fetched_at: new Date().toISOString()
  }, 200, cors);
}

async function fetchFromEwgf(id, env) {
  const token = env.EWGF_TOKEN;
  if (!token) return null;
  
  const auth = { "Authorization": "Bearer " + token, "Accept": "application/json" };
  const base = "https://api.ewgf.gg/external";
  const endpoints = {
    profile: base + "/profile/" + encodeURIComponent(id),
    battles: base + "/battles/" + encodeURIComponent(id),
    stats:   base + "/stats/" + encodeURIComponent(id),
  };

  async function tryFetch(u) {
    try {
      const r = await fetch(u, { headers: auth });
      if (!r.ok) return null;
      const txt = await r.text();
      try { return JSON.parse(txt); } catch (e) { return null; }
    } catch (e) { return null; }
  }

  const [profile, battles, stats] = await Promise.all([
    tryFetch(endpoints.profile),
    tryFetch(endpoints.battles),
    tryFetch(endpoints.stats),
  ]);

  if (!profile && !battles && !stats) return null;

  return { id, profile, battles, stats };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

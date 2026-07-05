// ============================================================
//  /api/characters  —  Character statistics and data
// ------------------------------------------------------------
//  Fetches character data from Tekathon API including play rates,
//  win rates, and usage statistics.
//  Usage: 
//    /api/characters - Get all characters
//    /api/characters?name=Jin%20Kazama - Get specific character
// ============================================================

import { getAllCharacters, getCharacterStats } from "../_lib/Tekathon-api.js";

export async function onRequest(context) {
  const { request, env } = context;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });

  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  try {
    if (name) {
      // Get specific character
      const result = await getCharacterStats(name, env);
      
      if (!result.success) {
        return json({ 
          success: false, 
          error: result.error || "Character not found" 
        }, 404, cors);
      }

      return json({
        success: true,
        cached: result.cached,
        data: result.data?.data || result.data,
        source: "Tekathon-api",
        fetched_at: new Date().toISOString()
      }, 200, cors);
    } else {
      // Get all characters
      const result = await getAllCharacters(env);
      
      if (!result.success) {
        return json({ 
          success: false, 
          error: result.error || "Failed to fetch characters" 
        }, 500, cors);
      }

      const characters = result.data?.data || result.data || [];
      
      return json({
        success: true,
        cached: result.cached,
        count: Array.isArray(characters) ? characters.length : 0,
        data: characters,
        source: "Tekathon-api",
        fetched_at: new Date().toISOString()
      }, 200, cors);
    }
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

// ============================================================
//  Tekathon API Client — shared library for calling your API
// ------------------------------------------------------------
//  This client handles requests to your Tekathon API with caching,
//  error handling, and fallback to ewgf.gg when needed.
// ============================================================

const Tekathon_API_BASE = "https://tekken-api.your-worker.workers.dev"; // Update with your actual API URL
const CACHE_TTL = {
  player: 3600,        // 1 hour
  character: 3600,     // 1 hour
  leaderboard: 300,    // 5 minutes
  stats: 3600          // 1 hour
};

/**
 * Fetch from Tekathon API with optional caching
 */
export async function fetchFromTekathon(endpoint, cacheKey, ttl, env) {
  const fullUrl = `${Tekathon_API_BASE}${endpoint}`;
  
  try {
    // Try cache first if env.CACHE is available
    if (env?.CACHE && cacheKey) {
      const cached = await env.CACHE.get(cacheKey, "json");
      if (cached) {
        return { success: true, data: cached, cached: true };
      }
    }

    // Fetch from API
    const response = await fetch(fullUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Tekathon-Website/1.0"
      }
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: `Tekathon API returned ${response.status}`,
        status: response.status 
      };
    }

    const data = await response.json();

    // Cache the result
    if (env?.CACHE && cacheKey && ttl) {
      await env.CACHE.put(cacheKey, JSON.stringify(data), { expirationTtl: ttl });
    }

    return { success: true, data, cached: false };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      fallback: true 
    };
  }
}

/**
 * Get player data - tries Tekathon API first, falls back to ewgf.gg
 */
export async function getPlayer(tekkenId, env) {
  const cacheKey = `player:${tekkenId}`;
  
  // Try Tekathon API first
  const result = await fetchFromTekathon(
    `/player/${encodeURIComponent(tekkenId)}`,
    cacheKey,
    CACHE_TTL.player,
    env
  );

  if (result.success && result.data?.success && result.data?.data) {
    return {
      success: true,
      source: "Tekathon",
      cached: result.cached,
      data: transformPlayerData(result.data.data)
    };
  }

  // Fallback to ewgf.gg
  return { success: false, needsEwgf: true };
}

/**
 * Get character statistics
 */
export async function getCharacterStats(characterName, env) {
  const cacheKey = `character:${characterName}`;
  
  return await fetchFromTekathon(
    `/character/${encodeURIComponent(characterName)}`,
    cacheKey,
    CACHE_TTL.character,
    env
  );
}

/**
 * Get all characters
 */
export async function getAllCharacters(env) {
  const cacheKey = "characters:all";
  
  return await fetchFromTekathon(
    "/character",
    cacheKey,
    CACHE_TTL.character,
    env
  );
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard(options = {}, env) {
  const { limit = 100, offset = 0, region = null, rank = null } = options;
  
  let endpoint = `/leaderboard?limit=${limit}&offset=${offset}`;
  if (region) endpoint = `/leaderboard/region/${encodeURIComponent(region)}`;
  if (rank) endpoint = `/leaderboard/rank/${encodeURIComponent(rank)}`;
  
  const cacheKey = `leaderboard:${region || rank || 'global'}:${limit}:${offset}`;
  
  return await fetchFromTekathon(
    endpoint,
    cacheKey,
    CACHE_TTL.leaderboard,
    env
  );
}

/**
 * Get analytics data
 */
export async function getAnalytics(type, env) {
  const validTypes = [
    'rank-distribution',
    'platform-stats',
    'region-stats',
    'most-played',
    'highest-winrate',
    'meta-summary',
    'main-distribution'
  ];
  
  if (!validTypes.includes(type)) {
    return { success: false, error: "Invalid analytics type" };
  }
  
  const cacheKey = `analytics:${type}`;
  
  return await fetchFromTekathon(
    `/analytics/${type}`,
    cacheKey,
    CACHE_TTL.stats,
    env
  );
}

/**
 * Search for players
 */
export async function searchPlayers(query, env) {
  if (!query || query.length < 2) {
    return { success: false, error: "Query too short" };
  }
  
  return await fetchFromTekathon(
    `/search?q=${encodeURIComponent(query)}`,
    null, // Don't cache search results
    0,
    env
  );
}

/**
 * Transform player data from Tekathon format to website format
 */
function transformPlayerData(player) {
  return {
    id: player.tekkenId || player.tekken_id,
    profile: {
      name: player.username,
      player_name: player.username,
      tekkenId: player.tekkenId || player.tekken_id,
      platform: player.platform,
      region: player.region,
      rank: player.currentRank || player.current_rank,
      highestRank: player.highestRank || player.highest_rank,
      main_character: player.mainCharacter || player.main_character,
      prowess: player.prowess,
      rating: player.prowess
    },
    stats: {
      wins: player.wins,
      losses: player.losses,
      winRate: player.winRate || player.win_rate,
      totalWins: player.wins,
      totalLosses: player.losses
    },
    battles: [],
    source: "Tekathon"
  };
}

/**
 * Merge Tekathon data with ewgf.gg data
 */
export function mergePlayerData(TekathonData, ewgfData) {
  if (!ewgfData) return TekathonData;
  if (!TekathonData) return ewgfData;
  
  return {
    id: TekathonData.id || ewgfData.id,
    profile: {
      ...ewgfData.profile,
      ...TekathonData.profile,
      // Prefer ewgf for real-time data
      rank: ewgfData.profile?.rank || TekathonData.profile?.rank,
      prowess: ewgfData.profile?.prowess || TekathonData.profile?.prowess
    },
    stats: {
      ...TekathonData.stats,
      ...ewgfData.stats
    },
    battles: ewgfData.battles || TekathonData.battles || [],
    source: "merged"
  };
}

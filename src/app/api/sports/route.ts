import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600;

// API Keys - Hardcoded for GitHub Pages deployment
// ⚠️ WARNING: These keys are exposed in client-side code
const ALLSPORTS_API_KEY = 'd09a6c7f46msh003f3f724580917p1a11d6jsnb95458edf64d';
const CRICAPI_KEY = 'f83068c1-8071-42b5-b698-744f85a96ae6';
const NEWSAPI_KEY = 'fa20f937e6354fcca7dfb82c0a4f2b9a';

// Base URLs
const ALLSPORTS_BASE_URL = 'https://allsportsapi.com/api';
const CRICAPI_BASE_URL = 'https://api.cricapi.com/v1';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

// Cache Durations
const LIVE_CACHE_MS = 60 * 1000; // 1 minute for live scores
const SCHEDULE_CACHE_MS = 60 * 60 * 1000; // 1 hour for schedules/news

// Caches
let liveCache: { data: any[]; timestamp: number } | null = null;
let scheduleCache: { data: any[]; timestamp: number } | null = null;
let newsCache: { data: any[]; timestamp: number } | null = null;
let seriesCache: { data: any; timestamp: number } | null = null;

console.log('[Route Handler] AllSports API:', ALLSPORTS_API_KEY ? '✓' : '✗');
console.log('[Route Handler] CricAPI:', CRICAPI_KEY ? '✓' : '✗');
console.log('[Route Handler] NewsAPI:', NEWSAPI_KEY ? '✓' : '✗');

function isCacheValid(cache: { timestamp: number } | null, duration: number): boolean {
  if (!cache) return false;
  return (Date.now() - cache.timestamp) < duration;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sport = searchParams.get('sport') || 'all';
  const type = searchParams.get('type') || 'live';
  const endpoint = searchParams.get('endpoint') || 'matches';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  console.log(`[Route Handler] Request: sport=${sport}, type=${type}, endpoint=${endpoint}, date=${date}`);

  try {
    // Handle News API endpoint
    if (endpoint === 'news') {
      if (!NEWSAPI_KEY) {
        return NextResponse.json({ error: 'NewsAPI key not configured' }, { status: 500 });
      }

      if (isCacheValid(newsCache, SCHEDULE_CACHE_MS)) {
        console.log(`[Route Handler] Using cached news (${Math.round((Date.now() - newsCache!.timestamp) / 1000)}s old)`);
        return NextResponse.json({ result: newsCache!.data, cached: true });
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

      const newsUrl = `${NEWSAPI_BASE_URL}/everything?q=sports&from=${fromDate}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${NEWSAPI_KEY}`;
      
      const response = await fetch(newsUrl);
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      const articles = data.articles?.map((a: any) => ({
        id: a.url,
        title: a.title,
        description: a.description,
        url: a.url,
        imageUrl: a.urlToImage,
        publishedAt: a.publishedAt,
        source: a.source?.name,
      })) || [];

      newsCache = { data: articles, timestamp: Date.now() };
      return NextResponse.json({ result: articles });
    }

    // Handle Series endpoint
    if (endpoint === 'series') {
      if (isCacheValid(seriesCache, SCHEDULE_CACHE_MS)) {
        return NextResponse.json({ result: seriesCache!.data, cached: true });
      }

      const seriesUrl = `${CRICAPI_BASE_URL}/series?apikey=${CRICAPI_KEY}`;
      const response = await fetch(seriesUrl);
      
      if (!response.ok) {
        throw new Error(`Series API error: ${response.status}`);
      }

      const data = await response.json();
      const series = data.data?.map((s: any) => ({
        id: s.id,
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
        status: s.status,
      })) || [];

      seriesCache = { data: series, timestamp: Date.now() };
      return NextResponse.json({ result: series });
    }

    // Handle Matches endpoint (default)
    let results: any[] = [];
    let dailyLimitReached = false;

    // Use appropriate cache based on type
    const useLiveCache = type === 'live' && isCacheValid(liveCache, LIVE_CACHE_MS);
    const useScheduleCache = type !== 'live' && isCacheValid(scheduleCache, SCHEDULE_CACHE_MS);

    if (useLiveCache) {
      console.log('[Route Handler] Using live cache');
      results = [...liveCache!.data];
    } else if (useScheduleCache) {
      console.log('[Route Handler] Using schedule cache');
      results = [...scheduleCache!.data];
    } else {
      // Fetch Cricket from CricAPI
      if (sport === 'cricket' || sport === 'all') {
        if (!CRICAPI_KEY) {
          return NextResponse.json({ error: 'CricAPI key not configured' }, { status: 500 });
        }

        try {
          const cricapiUrl = `${CRICAPI_BASE_URL}/currentMatches?apikey=${CRICAPI_KEY}&offset=0`;
          const response = await fetch(cricapiUrl, { headers: { 'Accept': 'application/json' } });

          if (!response.ok) {
            const errorText = await response.text();
            if (errorText.toLowerCase().includes('limit')) {
              dailyLimitReached = true;
              if (liveCache) results = [...liveCache.data];
            }
          } else {
            const data = await response.json();
            
            if (data.status === 'failure' && data.reason?.toLowerCase().includes('limit')) {
              dailyLimitReached = true;
              if (liveCache) results = [...liveCache.data];
            } else {
              const matches = (data.data || []).map((m: any) => {
                const homeTeamInfo = m.teamInfo?.find((t: any) => t.name === m.teams?.[0]) || {};
                const awayTeamInfo = m.teamInfo?.find((t: any) => t.name === m.teams?.[1]) || {};
                
                return {
                  id: m.id,
                  sport: 'cricket',
                  homeTeam: {
                    name: m.teams?.[0] || 'TBD',
                    score: m.score?.[0]?.r || '0',
                    wickets: m.score?.[0]?.w || '0',
                    overs: m.score?.[0]?.o || '0',
                    color: '#1e40af',
                    flag: homeTeamInfo.img || null,
                    shortName: homeTeamInfo.shortname || m.teams?.[0]?.substring(0, 3).toUpperCase(),
                  },
                  awayTeam: {
                    name: m.teams?.[1] || 'TBD',
                    score: m.score?.[1]?.r || '0',
                    wickets: m.score?.[1]?.w || '0',
                    overs: m.score?.[1]?.o || '0',
                    color: '#dc2626',
                    flag: awayTeamInfo.img || null,
                    shortName: awayTeamInfo.shortname || m.teams?.[1]?.substring(0, 3).toUpperCase(),
                  },
                  status: getCricketStatus(m.status),
                  statusDetail: m.status || '',
                  matchType: m.matchType || 'T20',
                  venue: m.venue || 'Unknown Venue',
                  date: m.date || new Date().toISOString(),
                  time: m.dateTimeGMT ? new Date(m.dateTimeGMT).toLocaleTimeString() : 'TBD',
                  league: m.series || 'International',
                  events: [],
                  streamUrl: null,
                };
              });

              results = [...results, ...matches];
            }
          }
        } catch (error: any) {
          console.error('[Route Handler] Cricket error:', error.message);
        }
      }

      // Fetch Football from AllSportsAPI with date parameter
      if (sport === 'football' || sport === 'all') {
        if (!ALLSPORTS_API_KEY) {
          return NextResponse.json({ error: 'AllSports API key not configured' }, { status: 500 });
        }

        try {
          const met = type === 'live' ? 'Livescore' : 'Fixtures';
          let fullUrl = `${ALLSPORTS_BASE_URL}/football/?met=${met}&APIkey=${ALLSPORTS_API_KEY}`;
          
          // Add date parameter for fixtures
          if (type !== 'live') {
            fullUrl += `&from=${date}&to=${date}`;
          }
          
          const response = await fetch(fullUrl, {
            headers: {
              'X-RapidAPI-Key': ALLSPORTS_API_KEY,
              'X-RapidAPI-Host': 'allsportsapi.com',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const matches = (data.result || []).map((m: any) => ({
              id: m.event_key,
              sport: 'football',
              homeTeam: {
                name: m.event_home_team || 'Home',
                score: m.event_final_result?.split('-')[0]?.trim() || m.event_live || '0',
                color: '#2563eb',
                flag: null,
                shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
              },
              awayTeam: {
                name: m.event_away_team || 'Away',
                score: m.event_final_result?.split('-')[1]?.trim() || '0',
                color: '#dc2626',
                flag: null,
                shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
              },
              status: getFootballStatus(m.event_status),
              statusDetail: m.event_status || '',
              league: m.league_name || 'Unknown League',
              venue: m.event_stadium || 'Unknown Venue',
              date: m.event_date || new Date().toISOString(),
              time: m.event_time || 'TBD',
              currentTime: m.event_status || '-',
              events: [],
              streamUrl: null,
            }));
            
            results = [...results, ...matches];
          }
        } catch (error: any) {
          console.error('[Route Handler] Football error:', error.message);
        }
      }

      // Fetch Basketball from AllSportsAPI with date parameter
      if (sport === 'basketball' || sport === 'all') {
        if (!ALLSPORTS_API_KEY) {
          return NextResponse.json({ error: 'AllSports API key not configured' }, { status: 500 });
        }

        try {
          const met = type === 'live' ? 'Livescore' : 'Fixtures';
          let fullUrl = `${ALLSPORTS_BASE_URL}/basketball/?met=${met}&APIkey=${ALLSPORTS_API_KEY}`;
          
          // Add date parameter for fixtures
          if (type !== 'live') {
            fullUrl += `&from=${date}&to=${date}`;
          }
          
          const response = await fetch(fullUrl, {
            headers: {
              'X-RapidAPI-Key': ALLSPORTS_API_KEY,
              'X-RapidAPI-Host': 'allsportsapi.com',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const matches = (data.result || []).map((m: any) => ({
              id: m.event_key,
              sport: 'basketball',
              homeTeam: {
                name: m.event_home_team || 'Home',
                score: m.event_final_result?.split('-')[0]?.trim() || m.event_live || '0',
                color: '#f59e0b',
                flag: null,
                shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
              },
              awayTeam: {
                name: m.event_away_team || 'Away',
                score: m.event_final_result?.split('-')[1]?.trim() || '0',
                color: '#7c3aed',
                flag: null,
                shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
              },
              status: getFootballStatus(m.event_status),
              statusDetail: m.event_status || '',
              league: m.league_name || 'Unknown League',
              venue: m.event_stadium || 'Unknown Venue',
              date: m.event_date || new Date().toISOString(),
              time: m.event_time || 'TBD',
              currentTime: m.event_status || '-',
              events: [],
              streamUrl: null,
            }));
            
            results = [...results, ...matches];
          }
        } catch (error: any) {
          console.error('[Route Handler] Basketball error:', error.message);
        }
      }

      // Update appropriate cache
      if (type === 'live') {
        liveCache = { data: results, timestamp: Date.now() };
      } else {
        scheduleCache = { data: results, timestamp: Date.now() };
      }
    }

    // Filter results by type
    let filteredResults = results;
    if (type === 'live') {
      filteredResults = results.filter((m: any) => m.status === 'live');
    } else if (type === 'scheduled') {
      // Get matches for next 7 days only
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      filteredResults = results.filter((m: any) => {
        if (m.status !== 'upcoming') return false;
        const matchDate = new Date(m.date);
        return matchDate >= today && matchDate <= nextWeek;
      });
      
      // Sort by date (earliest first)
      filteredResults.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (type === 'finished') {
      filteredResults = results.filter((m: any) => m.status === 'finished');
    }

    // Sort by date for finished matches (yesterday first)
    if (type === 'finished') {
      filteredResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // PRIORITY: Move IPL and PSL matches to the top for live and upcoming
    const priorityLeagues = ['ipl', 'indian premier league', 'psl', 'pakistan super league'];
    filteredResults.sort((a: any, b: any) => {
      const aLeague = (a.league || '').toLowerCase();
      const bLeague = (b.league || '').toLowerCase();
      const aIsPriority = priorityLeagues.some(p => aLeague.includes(p));
      const bIsPriority = priorityLeagues.some(p => bLeague.includes(p));
      
      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;
      return 0;
    });

    const response: any = { result: filteredResults };
    if (dailyLimitReached) {
      response.warning = 'Live updates paused to save API limits. Refreshing soon!';
    }
    if (isCacheValid(liveCache, LIVE_CACHE_MS) || isCacheValid(scheduleCache, SCHEDULE_CACHE_MS)) {
      response.cached = true;
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[Route Handler] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data', message: error.message },
      { status: 500 }
    );
  }
}

// Helper functions
function getCricketStatus(status: string): 'live' | 'upcoming' | 'finished' {
  if (!status) return 'upcoming';
  const s = status.toLowerCase();
  if (s.includes('live') || s.includes('stumps') || s.includes('innings break') || s.includes('lunch') || s.includes('tea') || s.includes('match started') || s.includes('in progress')) return 'live';
  if (s.includes('ended') || s.includes('completed') || s.includes('finished') || s.includes('won by') || s.includes('match over')) return 'finished';
  return 'upcoming';
}

function getFootballStatus(status: string): 'live' | 'upcoming' | 'finished' {
  if (!status) return 'upcoming';
  const s = status.toLowerCase();
  if (s.includes('live') || s.includes('first half') || s.includes('second half') || s.includes('half time')) return 'live';
  if (s.includes('finished') || s.includes('completed') || s.includes('ended')) return 'finished';
  return 'upcoming';
}

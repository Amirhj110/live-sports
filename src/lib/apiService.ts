import { Match, SportType, Team, MatchEvent, Player, NewsArticle } from '@/types/match';

// API Keys - Read from environment variables (set in GitHub Secrets)
const ALLSPORTS_API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '';
const CRICAPI_KEY = process.env.NEXT_PUBLIC_CRICKET_API_KEY || '';
const NEWSAPI_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWSAPI_KEY || '';

// Base URLs
const ALLSPORTS_BASE_URL = 'https://allsportsapi.com/api';
const CRICAPI_BASE_URL = 'https://api.cricapi.com/v1';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

interface AllSportsMatch {
  id: string;
  status: string;
  homeTeam: {
    id: string;
    name: string;
    shortName?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName?: string;
  };
  homeScore?: string;
  awayScore?: string;
  startTime: string;
  currentTime?: string;
  venue?: string;
  events?: any[];
  streamUrl?: string;
  streamLinks?: { url: string; name: string }[];
  sport: string;
  league: string;
}

function mapAllSportsToMatch(data: any, sport: SportType): Match {
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  // Extract team colors based on name (simplified)
  const getTeamColor = (name: string) => {
    const colors: Record<string, string> = {
      'Karachi Kings': '#1a237e',
      'Lahore Qalandars': '#d32f2f',
      'Islamabad United': '#ff6f00',
      'Peshawar Zalmi': '#fbc02d',
      'Quetta Gladiators': '#7b1fa2',
      'Multan Sultans': '#00695c',
      'Manchester City': '#6cabdd',
      'Manchester United': '#da291c',
      'Arsenal': '#ef0107',
      'Liverpool': '#c8102e',
      'Chelsea': '#034694',
      'Tottenham': '#132257',
      'Barcelona': '#a50044',
      'Real Madrid': '#f1c40f',
    };
    return colors[name] || '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  // Map events if available
  const events: MatchEvent[] = (data.events || []).map((e: any) => ({
    id: e.id || generateId(),
    type: e.type || 'goal',
    minute: e.minute || 0,
    description: e.description || e.text || '',
    player: e.player?.name || '',
    team: e.team === 'home' ? 'home' : 'away',
  }));

  // Map players if available
  const mapPlayers = (teamData: any): Player[] => {
    if (!teamData.players) return [];
    return teamData.players.map((p: any) => ({
      id: p.id || generateId(),
      name: p.name || p.shortName || 'Player',
      number: p.jerseyNumber || p.number || 0,
      position: p.position || 'Unknown',
      isPlaying: p.isPlaying || p.isInLineup || false,
    }));
  };

  const homeTeam: Team = {
    id: data.homeTeam?.id || generateId(),
    name: data.homeTeam?.name || 'Home Team',
    shortName: data.homeTeam?.shortName || data.homeTeam?.name?.substring(0, 3).toUpperCase() || 'HOM',
    logo: data.homeTeam?.logo || '/teams/default.png',
    color: getTeamColor(data.homeTeam?.name || ''),
    score: data.homeScore?.current?.toString() || data.homeScore || '-',
    players: mapPlayers(data.homeTeam),
  };

  const awayTeam: Team = {
    id: data.awayTeam?.id || generateId(),
    name: data.awayTeam?.name || 'Away Team',
    shortName: data.awayTeam?.shortName || data.awayTeam?.name?.substring(0, 3).toUpperCase() || 'AWY',
    logo: data.awayTeam?.logo || '/teams/default.png',
    color: getTeamColor(data.awayTeam?.name || ''),
    score: data.awayScore?.current?.toString() || data.awayScore || '-',
    players: mapPlayers(data.awayTeam),
  };

  // Determine match status
  let status: 'live' | 'upcoming' | 'finished' = 'upcoming';
  if (data.status === 'LIVE' || data.status === 'IN_PLAY' || data.status === '1H' || data.status === '2H') {
    status = 'live';
  } else if (data.status === 'FINISHED' || data.status === 'FT' || data.status === 'COMPLETED') {
    status = 'finished';
  }

  // Get stream URL from API or use fallback
  const streamUrl = data.streamUrl || data.streamLinks?.[0]?.url || '';

  // Extract date and time from startTime
  const startTimeVal = data.startTime || data.scheduled || new Date().toISOString();
  const startDate = new Date(startTimeVal);
  const date = startDate.toISOString().split('T')[0];
  const time = startDate.toTimeString().slice(0, 5);

  return {
    id: data.id || generateId(),
    sport,
    league: data.tournament?.name || data.league?.name || data.league || 'Unknown League',
    status,
    date,
    time,
    homeTeam,
    awayTeam,
    startTime: startTimeVal,
    currentTime: data.currentTime || data.minute?.toString() || '-',
    venue: data.venue?.name || data.venue || 'Unknown Venue',
    events,
    streamUrl,
    streamType: streamUrl ? (streamUrl.includes('youtube') ? 'youtube' : 'hls') : 'none',
  };
}

// Fetch live cricket matches
export async function fetchLiveCricketMatches(): Promise<Match[]> {
  try {
    const cricapiUrl = `${CRICAPI_BASE_URL}/currentMatches?apikey=${CRICAPI_KEY}&offset=0`;
    const response = await fetch(cricapiUrl, { 
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'failure') {
      console.error('CricAPI error:', data.reason);
      return [];
    }

    // Transform API response to Match type
    const matches = (data.data || []).map((m: any) => {
      const homeTeamInfo = m.teamInfo?.find((t: any) => t.name === m.teams?.[0]) || {};
      const awayTeamInfo = m.teamInfo?.find((t: any) => t.name === m.teams?.[1]) || {};
      
      return {
        id: m.id,
        sport: 'cricket' as const,
        league: m.series || 'International',
        status: getCricketStatus(m.status),
        date: m.date || new Date().toISOString().split('T')[0],
        time: m.dateTimeGMT ? new Date(m.dateTimeGMT).toLocaleTimeString() : 'TBD',
        homeTeam: {
          id: homeTeamInfo.id || m.teams?.[0],
          name: m.teams?.[0] || 'TBD',
          shortName: homeTeamInfo.shortname || m.teams?.[0]?.substring(0, 3).toUpperCase(),
          score: m.score?.[0]?.r || '0',
          wickets: m.score?.[0]?.w || '0',
          overs: m.score?.[0]?.o || '0',
          color: '#1e40af',
          flag: homeTeamInfo.img || null,
        },
        awayTeam: {
          id: awayTeamInfo.id || m.teams?.[1],
          name: m.teams?.[1] || 'TBD',
          shortName: awayTeamInfo.shortname || m.teams?.[1]?.substring(0, 3).toUpperCase(),
          score: m.score?.[1]?.r || '0',
          wickets: m.score?.[1]?.w || '0',
          overs: m.score?.[1]?.o || '0',
          color: '#dc2626',
          flag: awayTeamInfo.img || null,
        },
        currentTime: m.status || '-',
        venue: m.venue || 'Unknown Venue',
        events: [],
        streamUrl: null,
      };
    });
    
    // Prioritize PSL and International matches
    return matches.sort((a: Match, b: Match) => {
      const aIsPSL = a.league?.toLowerCase().includes('super league') || a.league?.toLowerCase().includes('psl');
      const bIsPSL = b.league?.toLowerCase().includes('super league') || b.league?.toLowerCase().includes('psl');
      const aIsIntl = a.league?.toLowerCase().includes('international') || a.league?.toLowerCase().includes('icc');
      const bIsIntl = b.league?.toLowerCase().includes('international') || b.league?.toLowerCase().includes('icc');
      
      if (aIsPSL && !bIsPSL) return -1;
      if (!aIsPSL && bIsPSL) return 1;
      if (aIsIntl && !bIsIntl) return -1;
      if (!aIsIntl && bIsIntl) return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error fetching cricket matches:', error);
    return [];
  }
}

// Helper function for cricket status
function getCricketStatus(status: string): 'live' | 'upcoming' | 'finished' {
  if (!status) return 'upcoming';
  const s = status.toLowerCase();
  if (s.includes('live') || s.includes('stumps') || s.includes('innings break') || s.includes('lunch') || s.includes('tea') || s.includes('match started') || s.includes('in progress')) return 'live';
  if (s.includes('ended') || s.includes('completed') || s.includes('finished') || s.includes('won by') || s.includes('match over')) return 'finished';
  return 'upcoming';
}

// Helper function for football/basketball status
function getFootballStatus(status: string): 'live' | 'upcoming' | 'finished' {
  if (!status) return 'upcoming';
  const s = status.toLowerCase();
  if (s.includes('live') || s.includes('first half') || s.includes('second half') || s.includes('half time')) return 'live';
  if (s.includes('finished') || s.includes('completed') || s.includes('ended')) return 'finished';
  return 'upcoming';
}

// Fetch live football matches
export async function fetchLiveFootballMatches(): Promise<Match[]> {
  try {
    const date = new Date().toISOString().split('T')[0];
    const fullUrl = `${ALLSPORTS_BASE_URL}/football/?met=Livescore&APIkey=${ALLSPORTS_API_KEY}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'X-RapidAPI-Key': ALLSPORTS_API_KEY,
        'X-RapidAPI-Host': 'allsportsapi.com',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    const matches = (data.result || []).map((m: any) => ({
      id: m.event_key,
      sport: 'football' as const,
      league: m.league_name || 'Unknown League',
      status: getFootballStatus(m.event_status),
      date: m.event_date || new Date().toISOString(),
      time: m.event_time || 'TBD',
      homeTeam: {
        id: m.event_home_team,
        name: m.event_home_team || 'Home',
        shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[0]?.trim() || m.event_live || '0',
        color: '#2563eb',
        flag: null,
      },
      awayTeam: {
        id: m.event_away_team,
        name: m.event_away_team || 'Away',
        shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[1]?.trim() || '0',
        color: '#dc2626',
        flag: null,
      },
      currentTime: m.event_status || '-',
      venue: m.event_stadium || 'Unknown Venue',
      events: [],
      streamUrl: null,
    }));
    
    // Prioritize major leagues
    const majorLeagues = ['premier league', 'la liga', 'serie a', 'bundesliga', 'champions league'];
    return matches.sort((a: Match, b: Match) => {
      const aPriority = majorLeagues.findIndex(l => a.league?.toLowerCase().includes(l));
      const bPriority = majorLeagues.findIndex(l => b.league?.toLowerCase().includes(l));
      return (aPriority === -1 ? 999 : aPriority) - (bPriority === -1 ? 999 : bPriority);
    });
  } catch (error) {
    console.error('Error fetching football matches:', error);
    return [];
  }
}

// Fetch scheduled/upcoming matches
export async function fetchScheduledMatches(): Promise<Match[]> {
  try {
    const date = new Date().toISOString().split('T')[0];
    
    // Fetch cricket scheduled
    const cricketUrl = `${CRICAPI_BASE_URL}/currentMatches?apikey=${CRICAPI_KEY}&offset=0`;
    const cricketResponse = await fetch(cricketUrl).catch(() => null);
    let cricketMatches: Match[] = [];
    if (cricketResponse?.ok) {
      const cricketData = await cricketResponse.json();
      cricketMatches = (cricketData.data || [])
        .filter((m: any) => {
          const status = getCricketStatus(m.status);
          return status === 'upcoming';
        })
        .map((m: any) => ({
          id: m.id,
          sport: 'cricket' as const,
          league: m.series || 'International',
          status: 'upcoming' as const,
          date: m.date || new Date().toISOString().split('T')[0],
          time: m.dateTimeGMT ? new Date(m.dateTimeGMT).toLocaleTimeString() : 'TBD',
          homeTeam: {
            id: m.teams?.[0],
            name: m.teams?.[0] || 'TBD',
            shortName: m.teams?.[0]?.substring(0, 3).toUpperCase(),
            score: '0',
            color: '#1e40af',
            flag: null,
          },
          awayTeam: {
            id: m.teams?.[1],
            name: m.teams?.[1] || 'TBD',
            shortName: m.teams?.[1]?.substring(0, 3).toUpperCase(),
            score: '0',
            color: '#dc2626',
            flag: null,
          },
          currentTime: 'Scheduled',
          venue: m.venue || 'Unknown Venue',
          events: [],
          streamUrl: null,
        }));
    }

    // Fetch football scheduled
    const footballUrl = `${ALLSPORTS_BASE_URL}/football/?met=Fixtures&APIkey=${ALLSPORTS_API_KEY}&from=${date}&to=${date}`;
    const footballResponse = await fetch(footballUrl, {
      headers: {
        'X-RapidAPI-Key': ALLSPORTS_API_KEY,
        'X-RapidAPI-Host': 'allsportsapi.com',
      },
    }).catch(() => null);
    
    let footballMatches: Match[] = [];
    if (footballResponse?.ok) {
      const footballData = await footballResponse.json();
      footballMatches = (footballData.result || [])
        .filter((m: any) => getFootballStatus(m.event_status) === 'upcoming')
        .map((m: any) => ({
          id: m.event_key,
          sport: 'football' as const,
          league: m.league_name || 'Unknown League',
          status: 'upcoming' as const,
          date: m.event_date || new Date().toISOString(),
          time: m.event_time || 'TBD',
          homeTeam: {
            id: m.event_home_team,
            name: m.event_home_team || 'Home',
            shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
            score: '0',
            color: '#2563eb',
            flag: null,
          },
          awayTeam: {
            id: m.event_away_team,
            name: m.event_away_team || 'Away',
            shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
            score: '0',
            color: '#dc2626',
            flag: null,
          },
          currentTime: 'Scheduled',
          venue: m.event_stadium || 'Unknown Venue',
          events: [],
          streamUrl: null,
        }));
    }

    return [...cricketMatches, ...footballMatches];
  } catch (error) {
    console.error('Error fetching scheduled matches:', error);
    return [];
  }
}

// Fetch live tennis matches
export async function fetchLiveTennisMatches(): Promise<Match[]> {
  try {
    const fullUrl = `${ALLSPORTS_BASE_URL}/tennis/?met=Livescore&APIkey=${ALLSPORTS_API_KEY}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'X-RapidAPI-Key': ALLSPORTS_API_KEY,
        'X-RapidAPI-Host': 'allsportsapi.com',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    const matches = (data.result || []).map((m: any) => ({
      id: m.event_key,
      sport: 'tennis' as const,
      league: m.league_name || 'ATP/WTA',
      status: getFootballStatus(m.event_status),
      date: m.event_date || new Date().toISOString(),
      time: m.event_time || 'TBD',
      homeTeam: {
        id: m.event_home_team,
        name: m.event_home_team || 'Player 1',
        shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[0]?.trim() || m.event_live || '0',
        color: '#22c55e',
        flag: null,
      },
      awayTeam: {
        id: m.event_away_team,
        name: m.event_away_team || 'Player 2',
        shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[1]?.trim() || '0',
        color: '#f59e0b',
        flag: null,
      },
      currentTime: m.event_status || '-',
      venue: m.event_stadium || 'Unknown Venue',
      events: [],
      streamUrl: null,
    }));
    
    return matches.filter((m: Match) => m.status === 'live');
  } catch (error) {
    console.error('Error fetching tennis matches:', error);
    return [];
  }
}

// Fetch live basketball matches
export async function fetchLiveBasketballMatches(): Promise<Match[]> {
  try {
    const fullUrl = `${ALLSPORTS_BASE_URL}/basketball/?met=Livescore&APIkey=${ALLSPORTS_API_KEY}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'X-RapidAPI-Key': ALLSPORTS_API_KEY,
        'X-RapidAPI-Host': 'allsportsapi.com',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    const matches = (data.result || []).map((m: any) => ({
      id: m.event_key,
      sport: 'basketball' as const,
      league: m.league_name || 'NBA',
      status: getFootballStatus(m.event_status),
      date: m.event_date || new Date().toISOString(),
      time: m.event_time || 'TBD',
      homeTeam: {
        id: m.event_home_team,
        name: m.event_home_team || 'Home',
        shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[0]?.trim() || m.event_live || '0',
        color: '#f97316',
        flag: null,
      },
      awayTeam: {
        id: m.event_away_team,
        name: m.event_away_team || 'Away',
        shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[1]?.trim() || '0',
        color: '#8b5cf6',
        flag: null,
      },
      currentTime: m.event_status || '-',
      venue: m.event_stadium || 'Unknown Venue',
      events: [],
      streamUrl: null,
    }));
    
    return matches.filter((m: Match) => m.status === 'live');
  } catch (error) {
    console.error('Error fetching basketball matches:', error);
    return [];
  }
}

// Fetch live volleyball matches
export async function fetchLiveVolleyballMatches(): Promise<Match[]> {
  try {
    const fullUrl = `${ALLSPORTS_BASE_URL}/volleyball/?met=Livescore&APIkey=${ALLSPORTS_API_KEY}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'X-RapidAPI-Key': ALLSPORTS_API_KEY,
        'X-RapidAPI-Host': 'allsportsapi.com',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    const matches = (data.result || []).map((m: any) => ({
      id: m.event_key,
      sport: 'volleyball' as const,
      league: m.league_name || 'FIVB',
      status: getFootballStatus(m.event_status),
      date: m.event_date || new Date().toISOString(),
      time: m.event_time || 'TBD',
      homeTeam: {
        id: m.event_home_team,
        name: m.event_home_team || 'Home',
        shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[0]?.trim() || m.event_live || '0',
        color: '#06b6d4',
        flag: null,
      },
      awayTeam: {
        id: m.event_away_team,
        name: m.event_away_team || 'Away',
        shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
        score: m.event_final_result?.split('-')[1]?.trim() || '0',
        color: '#ec4899',
        flag: null,
      },
      currentTime: m.event_status || '-',
      venue: m.event_stadium || 'Unknown Venue',
      events: [],
      streamUrl: null,
    }));
    
    return matches.filter((m: Match) => m.status === 'live');
  } catch (error) {
    console.error('Error fetching volleyball matches:', error);
    return [];
  }
}

// Fetch all live matches (combined - multi-sport)
export async function fetchAllLiveMatches(): Promise<Match[]> {
  const [cricket, football, tennis, basketball, volleyball] = await Promise.all([
    fetchLiveCricketMatches().catch(() => []),
    fetchLiveFootballMatches().catch(() => []),
    fetchLiveTennisMatches().catch(() => []),
    fetchLiveBasketballMatches().catch(() => []),
    fetchLiveVolleyballMatches().catch(() => []),
  ]);
  
  const allMatches = [...cricket, ...football, ...tennis, ...basketball, ...volleyball];
  
  // Prioritize: Cricket (PSL/IPL) > Football > Others
  return allMatches.sort((a, b) => {
    const aIsPSL = a.league?.toLowerCase().includes('super league') || a.league?.toLowerCase().includes('psl');
    const bIsPSL = b.league?.toLowerCase().includes('super league') || b.league?.toLowerCase().includes('psl');
    const aIsIPL = a.league?.toLowerCase().includes('indian premier') || a.league?.toLowerCase().includes('ipl');
    const bIsIPL = b.league?.toLowerCase().includes('indian premier') || b.league?.toLowerCase().includes('ipl');
    const aIsCricket = a.sport === 'cricket';
    const bIsCricket = b.sport === 'cricket';
    const aIsFootball = a.sport === 'football';
    const bIsFootball = b.sport === 'football';
    
    if (aIsPSL && !bIsPSL) return -1;
    if (!aIsPSL && bIsPSL) return 1;
    if (aIsIPL && !bIsIPL) return -1;
    if (!aIsIPL && bIsIPL) return 1;
    if (aIsCricket && !bIsCricket) return -1;
    if (!aIsCricket && bIsCricket) return 1;
    if (aIsFootball && !bIsFootball) return -1;
    if (!aIsFootball && bIsFootball) return 1;
    return 0;
  });
}

// Fetch finished/recently completed matches
export async function fetchFinishedMatches(): Promise<Match[]> {
  try {
    const date = new Date().toISOString().split('T')[0];
    
    // Fetch cricket finished matches
    const cricketUrl = `${CRICAPI_BASE_URL}/currentMatches?apikey=${CRICAPI_KEY}&offset=0`;
    const cricketResponse = await fetch(cricketUrl).catch(() => null);
    let cricketMatches: Match[] = [];
    if (cricketResponse?.ok) {
      const cricketData = await cricketResponse.json();
      cricketMatches = (cricketData.data || [])
        .filter((m: any) => {
          const status = getCricketStatus(m.status);
          return status === 'finished';
        })
        .map((m: any) => ({
          id: m.id,
          sport: 'cricket' as const,
          league: m.series || 'International',
          status: 'finished' as const,
          date: m.date || new Date().toISOString().split('T')[0],
          time: m.dateTimeGMT ? new Date(m.dateTimeGMT).toLocaleTimeString() : 'TBD',
          homeTeam: {
            id: m.teams?.[0],
            name: m.teams?.[0] || 'TBD',
            shortName: m.teams?.[0]?.substring(0, 3).toUpperCase(),
            score: m.score?.[0]?.r || '0',
            wickets: m.score?.[0]?.w || '0',
            overs: m.score?.[0]?.o || '0',
            color: '#1e40af',
            flag: null,
          },
          awayTeam: {
            id: m.teams?.[1],
            name: m.teams?.[1] || 'TBD',
            shortName: m.teams?.[1]?.substring(0, 3).toUpperCase(),
            score: m.score?.[1]?.r || '0',
            wickets: m.score?.[1]?.w || '0',
            overs: m.score?.[1]?.o || '0',
            color: '#dc2626',
            flag: null,
          },
          currentTime: m.status || 'Finished',
          venue: m.venue || 'Unknown Venue',
          events: [],
          streamUrl: null,
        }));
    }

    // Fetch football finished matches
    const footballUrl = `${ALLSPORTS_BASE_URL}/football/?met=Livescore&APIkey=${ALLSPORTS_API_KEY}`;
    const footballResponse = await fetch(footballUrl, {
      headers: {
        'X-RapidAPI-Key': ALLSPORTS_API_KEY,
        'X-RapidAPI-Host': 'allsportsapi.com',
      },
    }).catch(() => null);
    
    let footballMatches: Match[] = [];
    if (footballResponse?.ok) {
      const footballData = await footballResponse.json();
      footballMatches = (footballData.result || [])
        .filter((m: any) => getFootballStatus(m.event_status) === 'finished')
        .map((m: any) => ({
          id: m.event_key,
          sport: 'football' as const,
          league: m.league_name || 'Unknown League',
          status: 'finished' as const,
          date: m.event_date || new Date().toISOString(),
          time: m.event_time || 'TBD',
          homeTeam: {
            id: m.event_home_team,
            name: m.event_home_team || 'Home',
            shortName: m.event_home_team?.substring(0, 3).toUpperCase(),
            score: m.event_final_result?.split('-')[0]?.trim() || '0',
            color: '#2563eb',
            flag: null,
          },
          awayTeam: {
            id: m.event_away_team,
            name: m.event_away_team || 'Away',
            shortName: m.event_away_team?.substring(0, 3).toUpperCase(),
            score: m.event_final_result?.split('-')[1]?.trim() || '0',
            color: '#dc2626',
            flag: null,
          },
          currentTime: 'Finished',
          venue: m.event_stadium || 'Unknown Venue',
          events: [],
          streamUrl: null,
        }));
    }

    return [...cricketMatches, ...footballMatches];
  } catch (error) {
    console.error('Error fetching finished matches:', error);
    return [];
  }
}

// Fetch sports news
export async function fetchSportsNews(): Promise<NewsArticle[]> {
  try {
    const newsUrl = `${NEWSAPI_BASE_URL}/everything?q=sports+cricket+football+tennis+basketball&sortBy=publishedAt&pageSize=10&apiKey=${NEWSAPI_KEY}`;
    const response = await fetch(newsUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.articles || []).map((article: any, index: number) => ({
      id: `news-${index}`,
      title: article.title || 'No Title',
      description: article.description || '',
      url: article.url || '#',
      imageUrl: article.urlToImage || null,
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt || new Date().toISOString(),
      sport: 'general' as const,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Get streaming link for a match
export async function getMatchStreamLink(matchId: string, sport: SportType): Promise<string | null> {
  // Fallback to official broadcast channels based on sport type
  const officialStreams: Record<string, string> = {
    'PSL': 'https://www.youtube.com/@PakistanSuperLeagueOfficial',
    'Pakistan Super League': 'https://www.youtube.com/@PakistanSuperLeagueOfficial',
    'IPL': 'https://www.youtube.com/@IPL',
    'Premier League': 'https://www.youtube.com/@premierleague',
    'La Liga': 'https://www.youtube.com/@LaLiga',
  };

  return officialStreams[sport] || null;
}

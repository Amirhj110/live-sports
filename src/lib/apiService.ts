import { Match, SportType, Team, MatchEvent, Player } from '@/types/match';

const LOCAL_API_URL = '/api/sports'; // Local Route Handler - API key stays server-side

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

  return {
    id: data.id || generateId(),
    sport,
    league: data.tournament?.name || data.league?.name || data.league || 'Unknown League',
    status,
    homeTeam,
    awayTeam,
    startTime: data.startTime || data.scheduled || new Date().toISOString(),
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
    const response = await fetch(`${LOCAL_API_URL}?sport=cricket&type=live`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Data is already transformed by Route Handler
    const matches = (data.result || [])
      .filter((m: any) => m.sport === 'cricket') as Match[];
    
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

// Fetch live football matches
export async function fetchLiveFootballMatches(): Promise<Match[]> {
  try {
    const response = await fetch(`${LOCAL_API_URL}?sport=football&type=live`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Data is already transformed by Route Handler
    const matches = (data.result || [])
      .filter((m: any) => m.sport === 'football') as Match[];
    
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
    const [cricketScheduled, footballScheduled] = await Promise.all([
      fetch(`${LOCAL_API_URL}?sport=cricket&type=scheduled`, {
        next: { revalidate: 300 },
      }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${LOCAL_API_URL}?sport=football&type=scheduled`, {
        next: { revalidate: 300 },
      }).then(r => r.ok ? r.json() : []).catch(() => []),
    ]);

    // Data is already transformed by Route Handler
    const cricketMatches = (cricketScheduled.result || [])
      .filter((m: any) => m.sport === 'cricket') as Match[];
    const footballMatches = (footballScheduled.result || [])
      .filter((m: any) => m.sport === 'football') as Match[];

    return [...cricketMatches, ...footballMatches].filter(m => m.status === 'upcoming');
  } catch (error) {
    console.error('Error fetching scheduled matches:', error);
    return [];
  }
}

// Fetch all live matches (combined)
export async function fetchAllLiveMatches(): Promise<Match[]> {
  const [cricket, football] = await Promise.all([
    fetchLiveCricketMatches(),
    fetchLiveFootballMatches(),
  ]);
  
  return [...cricket, ...football];
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

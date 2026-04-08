import { Match, MatchEvent, SportType, EventType } from '@/types/match';

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const mockMatches: Match[] = [
  // PSL Cricket Match - Live
  {
    id: generateId(),
    sport: 'cricket' as SportType,
    league: 'Pakistan Super League',
    status: 'live',
    date: '2026-04-03',
    time: '19:00',
    homeTeam: {
      id: generateId(),
      name: 'Karachi Kings',
      shortName: 'KK',
      logo: '/teams/karachi.png',
      color: '#1a237e',
      score: '187/4 (18.2)',
      players: [
        { id: generateId(), name: 'Shan Masood', number: 1, position: 'Batsman', isPlaying: true },
        { id: generateId(), name: 'James Vince', number: 2, position: 'Batsman', isPlaying: true },
        { id: generateId(), name: 'Shoaib Malik', number: 3, position: 'All-rounder', isPlaying: false },
        { id: generateId(), name: 'Mohammad Nawaz', number: 4, position: 'All-rounder', isPlaying: true },
        { id: generateId(), name: 'Hasan Ali', number: 5, position: 'Bowler', isPlaying: false },
        { id: generateId(), name: 'Mir Hamza', number: 6, position: 'Bowler', isPlaying: false },
      ],
    },
    awayTeam: {
      id: generateId(),
      name: 'Lahore Qalandars',
      shortName: 'LQ',
      logo: '/teams/lahore.png',
      color: '#d32f2f',
      score: '185/6 (20)',
      players: [
        { id: generateId(), name: 'Fakhar Zaman', number: 1, position: 'Batsman', isPlaying: true },
        { id: generateId(), name: 'Abdullah Shafique', number: 2, position: 'Batsman', isPlaying: false },
        { id: generateId(), name: 'Rassie van der Dussen', number: 3, position: 'Batsman', isPlaying: false },
        { id: generateId(), name: 'David Wiese', number: 4, position: 'All-rounder', isPlaying: true },
        { id: generateId(), name: 'Haris Rauf', number: 5, position: 'Bowler', isPlaying: false },
        { id: generateId(), name: 'Shaheen Afridi', number: 6, position: 'Bowler', isPlaying: true },
      ],
    },
    startTime: '2026-04-03T19:00:00Z',
    currentTime: '18.2 overs',
    venue: 'National Stadium, Karachi',
    events: [
      { id: generateId(), type: 'boundary', minute: 2, description: 'Fakhar Zaman hits a boundary', player: 'Fakhar Zaman', team: 'away' },
      { id: generateId(), type: 'wicket', minute: 8, description: 'Abdullah Shafique bowled by Hasan Ali', player: 'Abdullah Shafique', team: 'away' },
      { id: generateId(), type: 'six', minute: 15, description: 'Rassie van der Dussen hits a six', player: 'Rassie van der Dussen', team: 'away' },
      { id: generateId(), type: 'wicket', minute: 22, description: 'Shoaib Malik caught at mid-wicket', player: 'Shoaib Malik', team: 'home' },
      { id: generateId(), type: 'boundary', minute: 28, description: 'James Vince hits a four', player: 'James Vince', team: 'home' },
      { id: generateId(), type: 'wicket', minute: 35, description: 'Fakhar Zaman stumped', player: 'Fakhar Zaman', team: 'away' },
    ],
    streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    streamType: 'youtube',
  },
  
  // Premier League - Live
  {
    id: generateId(),
    sport: 'football' as SportType,
    league: 'Premier League',
    status: 'live',
    date: '2026-04-03',
    time: '19:00',
    homeTeam: {
      id: generateId(),
      name: 'Manchester City',
      shortName: 'MCI',
      logo: '/teams/mancity.png',
      color: '#6cabdd',
      score: '2',
      players: [
        { id: generateId(), name: 'Ederson', number: 31, position: 'GK', isPlaying: true },
        { id: generateId(), name: 'Kyle Walker', number: 2, position: 'DF', isPlaying: true },
        { id: generateId(), name: 'Ruben Dias', number: 3, position: 'DF', isPlaying: true },
        { id: generateId(), name: 'John Stones', number: 5, position: 'DF', isPlaying: false },
        { id: generateId(), name: 'Phil Foden', number: 47, position: 'MF', isPlaying: true },
        { id: generateId(), name: 'Kevin De Bruyne', number: 17, position: 'MF', isPlaying: true },
        { id: generateId(), name: 'Erling Haaland', number: 9, position: 'FW', isPlaying: true },
      ],
    },
    awayTeam: {
      id: generateId(),
      name: 'Arsenal',
      shortName: 'ARS',
      logo: '/teams/arsenal.png',
      color: '#ef0107',
      score: '1',
      players: [
        { id: generateId(), name: 'David Raya', number: 22, position: 'GK', isPlaying: true },
        { id: generateId(), name: 'Ben White', number: 4, position: 'DF', isPlaying: true },
        { id: generateId(), name: 'William Saliba', number: 2, position: 'DF', isPlaying: true },
        { id: generateId(), name: 'Gabriel', number: 6, position: 'DF', isPlaying: true },
        { id: generateId(), name: 'Declan Rice', number: 41, position: 'MF', isPlaying: true },
        { id: generateId(), name: 'Martin Odegaard', number: 8, position: 'MF', isPlaying: true },
        { id: generateId(), name: 'Bukayo Saka', number: 7, position: 'FW', isPlaying: false },
      ],
    },
    startTime: '2026-04-03T17:30:00Z',
    currentTime: '78\'',
    venue: 'Etihad Stadium',
    events: [
      { id: generateId(), type: 'goal', minute: 12, description: 'Haaland opens the scoring with a powerful finish', player: 'Erling Haaland', team: 'home' },
      { id: generateId(), type: 'yellow_card', minute: 23, description: 'Yellow card for tactical foul', player: 'Declan Rice', team: 'away' },
      { id: generateId(), type: 'goal', minute: 34, description: 'Saka equalizes from the penalty spot', player: 'Bukayo Saka', team: 'away' },
      { id: generateId(), type: 'goal', minute: 56, description: 'De Bruyne scores a stunning long-range goal', player: 'Kevin De Bruyne', team: 'home' },
      { id: generateId(), type: 'substitution', minute: 65, description: 'Foden replaced by Bernardo Silva', player: 'Phil Foden', team: 'home' },
      { id: generateId(), type: 'red_card', minute: 72, description: 'Gabriel sent off for second yellow', player: 'Gabriel', team: 'away' },
    ],
    streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    streamType: 'youtube',
  },

  // NBA Basketball - Live
  {
    id: generateId(),
    sport: 'basketball' as SportType,
    league: 'NBA',
    status: 'live',
    date: '2026-04-03',
    time: '02:00',
    homeTeam: {
      id: generateId(),
      name: 'Los Angeles Lakers',
      shortName: 'LAL',
      logo: '/teams/lakers.png',
      color: '#552583',
      score: '98',
      players: [
        { id: generateId(), name: 'LeBron James', number: 23, position: 'SF', isPlaying: true },
        { id: generateId(), name: 'Anthony Davis', number: 3, position: 'PF', isPlaying: true },
        { id: generateId(), name: 'D\'Angelo Russell', number: 1, position: 'PG', isPlaying: true },
        { id: generateId(), name: 'Austin Reaves', number: 15, position: 'SG', isPlaying: true },
        { id: generateId(), name: 'Rui Hachimura', number: 28, position: 'PF', isPlaying: false },
      ],
    },
    awayTeam: {
      id: generateId(),
      name: 'Golden State Warriors',
      shortName: 'GSW',
      logo: '/teams/warriors.png',
      color: '#1d428a',
      score: '94',
      players: [
        { id: generateId(), name: 'Stephen Curry', number: 30, position: 'PG', isPlaying: true },
        { id: generateId(), name: 'Klay Thompson', number: 11, position: 'SG', isPlaying: true },
        { id: generateId(), name: 'Draymond Green', number: 23, position: 'PF', isPlaying: true },
        { id: generateId(), name: 'Andrew Wiggins', number: 22, position: 'SF', isPlaying: true },
        { id: generateId(), name: 'Chris Paul', number: 3, position: 'PG', isPlaying: false },
      ],
    },
    startTime: '2026-04-03T02:00:00Z',
    currentTime: 'Q4 - 4:32',
    venue: 'Crypto.com Arena',
    events: [
      { id: generateId(), type: 'timeout', minute: 12, description: 'Lakers call timeout', team: 'home' },
      { id: generateId(), type: 'timeout', minute: 24, description: 'End of Q1 - Warriors lead 28-25', team: 'away' },
      { id: generateId(), type: 'timeout', minute: 36, description: 'Halftime - Lakers lead 52-48', team: 'home' },
      { id: generateId(), type: 'timeout', minute: 48, description: 'End of Q3 - Tied 76-76', team: 'home' },
    ],
    streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    streamType: 'youtube',
  },

  // Premier League - Upcoming
  {
    id: generateId(),
    sport: 'football' as SportType,
    league: 'Premier League',
    status: 'upcoming',
    date: '2026-04-04',
    time: '16:30',
    homeTeam: {
      id: generateId(),
      name: 'Liverpool',
      shortName: 'LIV',
      logo: '/teams/liverpool.png',
      color: '#c8102e',
      score: '-',
      players: [
        { id: generateId(), name: 'Alisson Becker', number: 1, position: 'GK', isPlaying: false },
        { id: generateId(), name: 'Virgil van Dijk', number: 4, position: 'DF', isPlaying: false },
        { id: generateId(), name: 'Mohamed Salah', number: 11, position: 'FW', isPlaying: false },
        { id: generateId(), name: 'Darwin Nunez', number: 9, position: 'FW', isPlaying: false },
      ],
    },
    awayTeam: {
      id: generateId(),
      name: 'Manchester United',
      shortName: 'MUN',
      logo: '/teams/manutd.png',
      color: '#da291c',
      score: '-',
      players: [
        { id: generateId(), name: 'Andre Onana', number: 24, position: 'GK', isPlaying: false },
        { id: generateId(), name: 'Lisandro Martinez', number: 6, position: 'DF', isPlaying: false },
        { id: generateId(), name: 'Bruno Fernandes', number: 8, position: 'MF', isPlaying: false },
        { id: generateId(), name: 'Marcus Rashford', number: 10, position: 'FW', isPlaying: false },
      ],
    },
    startTime: '2026-04-04T16:30:00Z',
    currentTime: '-',
    venue: 'Anfield',
    events: [],
    streamUrl: '',
    streamType: 'none',
  },
];

export const getLiveMatches = () => mockMatches.filter(m => m.status === 'live');
export const getMatchById = (id: string, matches = mockMatches) => matches.find(m => m.id === id);

// Helper to update scores for live matches
export const updateMatchScore = (match: Match, team: 'home' | 'away'): Match => {
  const updated = { ...match };
  const teamData = team === 'home' ? updated.homeTeam : updated.awayTeam;
  
  if (match.sport === 'football') {
    // Football: increment goal count
    const currentScore = parseInt(teamData.score || '0') || 0;
    teamData.score = String(currentScore + 1);
  } else if (match.sport === 'basketball') {
    // Basketball: add 2-3 points
    const currentScore = parseInt(teamData.score || '0') || 0;
    const points = Math.random() > 0.7 ? 3 : 2;
    teamData.score = String(currentScore + points);
  } else if (match.sport === 'cricket') {
    // Cricket: add runs (simplified)
    const scoreMatch = (teamData.score || '').match(/(\d+)\/(\d+)/);
    if (scoreMatch) {
      const runs = parseInt(scoreMatch[1]);
      const wickets = parseInt(scoreMatch[2]);
      const runsToAdd = Math.floor(Math.random() * 4) + 1;
      teamData.score = `${runs + runsToAdd}/${wickets}`;
    }
  }
  
  return updated;
};

// Helper to add random events
export const addRandomEvent = (match: Match): Match => {
  const updated = { ...match };
  const events = [...updated.events];
  const team = Math.random() > 0.5 ? 'home' : 'away';
  const teamName = team === 'home' ? match.homeTeam.name : match.awayTeam.name;
  const players = (team === 'home' ? match.homeTeam.players : match.awayTeam.players) || [];
  const playingPlayers = players.filter(p => p.isPlaying);
  const player = playingPlayers[Math.floor(Math.random() * playingPlayers.length)]?.name || 'Player';
  
  let eventType = 'goal';
  let description = '';
  
  if (match.sport === 'football') {
    const types = ['goal', 'yellow_card', 'substitution'];
    eventType = types[Math.floor(Math.random() * types.length)];
    if (eventType === 'goal') description = `${player} scores!`;
    else if (eventType === 'yellow_card') description = `Yellow card for ${player}`;
    else description = `Substitution for ${teamName}`;
  } else if (match.sport === 'basketball') {
    const types = ['timeout', 'foul', 'three_pointer'];
    eventType = types[Math.floor(Math.random() * types.length)];
    if (eventType === 'three_pointer') description = `${player} hits a 3-pointer!`;
    else if (eventType === 'foul') description = `Foul on ${player}`;
    else description = `${teamName} calls timeout`;
  } else if (match.sport === 'cricket') {
    const types = ['boundary', 'six', 'wicket'];
    eventType = types[Math.floor(Math.random() * types.length)];
    if (eventType === 'six') description = `${player} hits a six!`;
    else if (eventType === 'boundary') description = `${player} hits a four!`;
    else description = `Wicket! ${player} is out`;
  }
  
  const newEvent: MatchEvent = {
    id: generateId(),
    type: eventType as EventType,
    minute: Math.floor(Math.random() * 90) + 1,
    description,
    player,
    team,
  };
  
  events.unshift(newEvent);
  updated.events = events.slice(0, 10); // Keep last 10 events
  
  return updated;
};

export type SportType = 'cricket' | 'football' | 'basketball';

export type MatchStatus = 'live' | 'upcoming' | 'finished';

export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'wicket' | 'boundary' | 'six' | 'over' | 'timeout' | 'quarter_end';

export interface MatchEvent {
  id: string;
  type: EventType;
  minute: number;
  description: string;
  player?: string;
  team: 'home' | 'away';
}

export interface Player {
  id: string;
  name: string;
  number?: number;
  position?: string;
  isPlaying: boolean;
}

export interface Team {
  id?: string;
  name: string;
  shortName: string;
  logo?: string;
  flag?: string | null;
  color: string;
  score?: string;
  wickets?: string;
  overs?: string;
  players?: Player[];
}

export interface Match {
  id: string;
  sport: SportType;
  league: string;
  status: MatchStatus;
  statusDetail?: string;
  matchType?: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  startTime?: string;
  currentTime?: string;
  venue: string;
  events: MatchEvent[];
  streamUrl?: string | null;
  streamType?: 'youtube' | 'hls' | 'none';
}

export interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source?: string;
}

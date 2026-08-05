export type Screen = 'home' | 'chat' | 'settings';

export type StatusType = 'online' | 'away' | 'busy' | 'offline';

export interface NowPlaying {
  trackName: string;
  artist: string;
  albumArt: string;
  spotifyUrl: string;
}

export interface Contact {
  id: string;
  name: string;
  displayName: string;
  status: StatusType;
  statusText: string;
  nowPlaying?: string;
  avatar: string;
  avatarColor: string;
  lastMessage?: string;
}

export interface Group {
  id: string;
  name: string;
  online: number;
  total: number;
  expanded: boolean;
  contacts: Contact[];
}

export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  type: 'text' | 'nudge' | 'system';
  timestamp: Date;
}

export type ProfileFrame = 'Windows XP' | 'Windows 7' | 'Windows Vista' | 'iOS' | 'Android';
export type Language = 'tr' | 'en';

export interface AppSettings {
  language: Language;
  profileFrame: ProfileFrame;
}

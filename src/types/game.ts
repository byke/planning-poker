import { CardConfig } from '../components/Players/CardPicker/CardConfigs';
import { Status } from './status';
import { ThemeName } from '../utils/themeUtils';

export interface TimerProps {
  currentSeconds?: number;
  totalSeconds?: number;
  soundOn?: boolean;
  timerVisible?: boolean;
  timerPaused?: boolean;
}

export interface Game {
  id: string;
  name: string;
  average: number;
  gameStatus: Status;
  gameType?: GameType | GameType.Fibonacci;
  isAllowMembersToManageSession?: boolean;
  storyName?: string;
  autoReveal?: boolean;
  cards: CardConfig[];
  createdBy: string;
  createdById: string;
  createdAt: Date;
  updatedAt?: Date;
  timerProps?: TimerProps;
  theme?: ThemeName; // ADD THIS LINE
}

export interface NewGame {
  name: string;
  gameType: string;
  cards: CardConfig[];
  isAllowMembersToManageSession?: boolean;
  createdBy: string;
  createdAt: Date;
  createdByTeam: string;
  createdByPlayerId?: string;
  theme?: ThemeName;
}

export enum GameType {
  Days = 'Days',
  DaysImperial = 'Days (Imperial)',
  Fibonacci = 'Fibonacci',
  ShortFibonacci = 'ShortFibonacci',
  TShirt = 'TShirt',
  TShirtAndNumber = 'TShirtAndNumber',
  Custom = 'Custom',
}
import type {LeagueInfoTeam} from './team';

export interface LeagueInfoResponse {
  league: LeagueInfo;
}
export interface LeagueInfo {
  id: string;
  shortName: string;
  longName: string;
  teamType: string;
  iconSmall: string;
  iconBig: string;
  currentSeasonId: string;
  currentRoundId: string;
  newsResId: string;
  country: {
    id: string;
    longname: string;
    iconSmall: string;
  };
  teams: {
    team: LeagueInfoTeam[];
  };
  gamedays: {
    gameday: Gameday[];
  }
}
export interface Gameday {
  id: string;
  title: string;
  dateFrom: string;
  dateTo: string;
}

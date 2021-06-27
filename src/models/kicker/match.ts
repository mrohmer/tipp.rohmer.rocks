import type {MatchTeam} from './team';

export interface MatchResponse {
  matches: {
    match: Match[];
  };
}
export interface Match {
  id: string;
  state: string;
  leagueId: string;
  seasonId: string;
  roundId: string;
  date: string;
  completed: string;
  approvalId: string;
  sportId: string;
  displayKey: string;
  homeTeam: Omit<MatchTeam, 'urlName'>;
  guestTeam: Omit<MatchTeam, 'urlName'>;
  stadium: Pick<Stadium, 'city'>
  results: {
    hergAktuell: string;
    aergAktuell: string;
    hergHz: string;
    aergHz: string;
    hergEnde: string;
    aergEnde: string;
    hergVerl?: string;
    aergVerl?: string;
  }
}

export interface MatchDetailResponse {
  match: MatchDetail;
}
export interface MatchDetail extends Match {
  leagueLongName: string;
  roundName: string;
  currentPeriod: string;
  timeConfirmed: string;
  sportId: string;
  displayKey: string;
  homeTeam: MatchTeam;
  guestTeam: MatchTeam;
  stadium: Stadium;
  referee: string;
  stats: Record<'hPlace' | 'aPlace' | 'hPoints' | 'aPoints' | 'hPointsAvg' | 'aPointsAvg' | 'hGoals' | 'aGoals' | 'hGoalsAvg' | 'aGoalsAvg' | 'hDuellWOn' | 'aDuellWOn' | 'hDuellDraw' | 'aDuellDraw' | 'hDuellLost' | 'aDuellLost', any>
}

export type Stadium = Record<'id' | 'name'| 'city'| 'lat'| 'lng', string>;

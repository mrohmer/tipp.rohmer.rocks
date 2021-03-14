interface Team {
  id: string;
  countryId: string;
  shortName: string;
  longName: string;
  iconSmall?: string;
  iconBig?: string;
  defaultLeagueId: string;
  lat: string;
  lng: string;
  groupId: string;
  groupName: string;
  token: string;
  urlName: string;
}

export type LeagueInfoTeam = Omit<Team, 'urlName'>;
export type MatchTeam = Pick<Team, 'id' | 'shortName' | 'longName' | 'token' | 'iconSmall' | 'iconBig' | 'defaultLeagueId' | 'urlName'>

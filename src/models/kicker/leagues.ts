export enum LeagueKey {
  EM_U21 = 'em-u21',
  EM = 'em',
  BUNDESLIGA = 'bl',
  BUNDESLIGA2 = 'bl2',
}

export const leagueMap: Record<LeagueKey, Record<'id'|'name', string>> = {
  [LeagueKey.EM_U21]: {
    id: '124',
    name: 'U21 EM',
  },
  [LeagueKey.EM]: {
    id: '107',
    name: 'EM',
  },
  [LeagueKey.BUNDESLIGA]: {
    id: '1',
    name: 'Bundeliga'
  },
  [LeagueKey.BUNDESLIGA2]: {
    id: '2',
    name: '2. Bundeliga'
  },
};

export enum LeagueKey {
  EM_U21 = 'em-u21',
  EM = 'em',
  BUNDESLIGA = 'bl',
  BUNDESLIGA2 = 'bl2',
}
export enum LeagueId {
  EM_U21 = '124',
  EM = '107',
  BUNDESLIGA = '1',
  BUNDESLIGA2 = '2',
}

export const leagueMap: Record<LeagueKey, { id: LeagueId, name: string }> = {
  [LeagueKey.EM_U21]: {
    id: LeagueId.EM_U21,
    name: 'U21 EM',
  },
  [LeagueKey.EM]: {
    id: LeagueId.EM,
    name: 'EM',
  },
  [LeagueKey.BUNDESLIGA]: {
    id: LeagueId.BUNDESLIGA,
    name: 'Bundeliga'
  },
  [LeagueKey.BUNDESLIGA2]: {
    id: LeagueId.BUNDESLIGA2,
    name: '2. Bundeliga'
  },
};

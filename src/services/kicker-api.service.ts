import {default as axios, AxiosResponse} from 'axios';
import type {LeagueInfoResponse} from '../models/kicker/league-info';
import type {MatchDetailResponse, MatchResponse} from '../models/kicker/match';

type AxiosPromise<T> = Promise<AxiosResponse<T>>;
const baseUrl = 'http://ovsyndication.kicker.de/API/android/1.0';
const buildUrl = (node, params?: Record<string, string | number>): string => {
  const transformedParams = [].concat(...Object.entries(params ?? {}));
  return `${[baseUrl, node, 3, ...transformedParams].join('/')}.json`;
}
const get = <T>(node: string, params?: Record<string, string | number>): AxiosPromise<T> => {
  return axios.get<T>(
    buildUrl(node, params),
  );
}
export const fetchLeagueInfo = (leagueId: string, season = new Date().getFullYear().toString()): AxiosPromise<LeagueInfoResponse> => {
  return get<LeagueInfoResponse>('LeagueSeasonInfo', {
    ligid: leagueId,
    saison: season,
  });
}
export const fetchGames = (leagueId: string, gameday: string, season = new Date().getFullYear().toString()): AxiosPromise<MatchResponse> =>
  get<MatchResponse>('GameDay', {
    ligid: leagueId,
    saison: season,
    spieltag: gameday,
  });
export const getMatchInfo = (matchId: string): AxiosPromise<MatchDetailResponse> =>
  get<MatchDetailResponse>('MatchInfos', {
    sppid: matchId,
  });

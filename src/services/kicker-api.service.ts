import {default as axios, AxiosResponse} from 'axios';
import type {LeagueInfo, LeagueInfoResponse} from '../models/kicker/league-info';
import type {MatchDetail, MatchDetailResponse, MatchResponse} from '../models/kicker/match';

type AxiosPromise<T> = Promise<AxiosResponse<T>>;
const baseUrl = 'http://ovsyndication.kicker.de/API/android/1.0';
const buildUrl = (node, params?: Record<string, string|number>): string => {
  console.log(params);
  const transformedParams = [].concat(...Object.entries(params ?? {}));
  console.log(JSON.stringify(transformedParams));
  return `${[baseUrl, node, 3, ...transformedParams].join('/')}.json`;
}
export const fetchLeagueInfo = (leagueId: string, season = new Date().getFullYear().toString()): AxiosPromise<LeagueInfoResponse> =>
  axios.get(buildUrl('LeagueSeasonInfo', {
    ligid: leagueId,
    saison: season,
  }));
export const fetchGames = (leagueId: string, gameday: string, season= new Date().getFullYear().toString()): AxiosPromise<MatchResponse> =>
  axios.get(buildUrl('GameDay', {
    ligid: leagueId,
    saison: season,
    spieltag: gameday,
  }));
export const getMatchInfo = (matchId: string): AxiosPromise<MatchDetailResponse> =>
  axios.get(buildUrl('MatchInfos', {
    sppid: matchId,
  }));

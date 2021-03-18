import {default as axios, AxiosResponse} from 'axios';
import type {LeagueInfoResponse} from '../models/kicker/league-info';
import type {MatchDetailResponse, MatchResponse} from '../models/kicker/match';
import {environment} from '../environments/environment';
import {CacheService} from './cache.service';
import {Cached} from '../decorators/cache';

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
export class KickerApiService {
  @Cached('league-info', {ttl: 60 * 60})
  static fetchLeagueInfo(leagueId: string, season?: string): AxiosPromise<LeagueInfoResponse> {
    return get<LeagueInfoResponse>('LeagueSeasonInfo', {
      ligid: leagueId,
      saison: environment.overrideSeason ?? season ?? new Date().getFullYear().toString(),
    });
  }
  @Cached('games', {ttl: 5 * 60})
  static fetchGames(leagueId: string, gameday: string, season?: string): AxiosPromise<MatchResponse> {
    return get<MatchResponse>('GameDay', {
      ligid: leagueId,
      saison: environment.overrideSeason ?? season ?? new Date().getFullYear().toString(),
      spieltag: gameday,
    });
  }

  @Cached('match-info', {ttl: 5 * 60})
  static getMatchInfo(matchId: string): AxiosPromise<MatchDetailResponse> {
    return get<MatchDetailResponse>('MatchInfos', {
      sppid: matchId,
    });
  }

}
export const fetchLeagueInfo = (leagueId: string, season?: string): AxiosPromise<LeagueInfoResponse> => KickerApiService.fetchLeagueInfo(leagueId, season);
export const fetchGames = (leagueId: string, gameday: string, season?: string): AxiosPromise<MatchResponse> => KickerApiService.fetchGames(leagueId, gameday, season);
export const getMatchInfo = (matchId: string): AxiosPromise<MatchDetailResponse> => KickerApiService.getMatchInfo(matchId);

import {Column, Entity, ObjectIdColumn} from "typeorm";
import type {LeagueId} from './kicker/leagues';

@Entity()
export class User {
  @ObjectIdColumn({ name: '_id', type: 'string' })
  id: string;
  @Column()
  foreignId: string;
  @Column()
  displayName: string;
  @Column()
  notificationsEnabled: boolean;
  @Column()
  notificationSubscriptions: Subscription[];
  @Column()
  points: Points = {};
}

export type Points = Partial<Record<LeagueId, Record<string, number>>>
export type Subscription = ({endpoint: string} & Record<string, any>);
export type Standings = StandingsItem[];
export interface StandingsItem {
  username: string;
  self: boolean;
  points: number;
}

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
  notificationEndpoints: string[];
  @Column()
  points: Points = {};
}

export type Points = Partial<Record<LeagueId, Record<string, number>>>

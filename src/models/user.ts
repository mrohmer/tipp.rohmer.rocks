import {Column, Entity, getConnection, ObjectIdColumn} from "typeorm";
import type {LeagueId} from './kicker/leagues';
import {UserGroupConnection} from './user-group-connection';
import {Group} from './group';
import {Tip} from './tip';

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

  async getGroups(): Promise<Group[]> {
    const connections = await getConnection().getRepository(UserGroupConnection).find({
      where: {
        userId: this.foreignId,
      }
    });

    if (!connections.length) {
      return [];
    }

    const groupIds = connections.map(({groupId}) => groupId);

    const groups = await getConnection().getRepository(Group).find();
    return groups.filter(group => groupIds.includes(group.id.toString()));
  }
  getTip(matchId: string): Promise<Tip> {
    return getConnection().getRepository(Tip).findOne({
      where: {
        userId: this.foreignId,
        matchId,
      }
    });
  }
}

export type Points = Partial<Record<LeagueId, Record<string, number>>>
export type Subscription = ({endpoint: string} & Record<string, any>);
export type Standings = StandingsItem[];
export interface StandingsItem {
  username: string;
  self: boolean;
  points: number;
}
export interface StandingsByGroup {
  id?: string;
  title: string;
  standings: Standings;
}

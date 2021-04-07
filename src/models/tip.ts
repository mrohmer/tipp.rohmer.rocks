import {Column, Entity, ObjectIdColumn} from 'typeorm';
import {v4 as uuid} from 'uuid';

@Entity('tip')
export class Tip {
  @ObjectIdColumn({name: '_id', type: 'string'})
  id: string;
  @Column()
  matchId: string;
  @Column()
  userId: string;
  @Column()
  home: number;
  @Column()
  guest: number;
  @Column()
  matchCompleted: boolean = false;
  @Column()
  points: number;
  @Column()
  season: string;
  @Column()
  leagueId: string;

  constructor() {
    this.id = uuid();
  }
}

export interface OthersTip {
  home: number;
  guest: number;
  username: string;
  anonymized: boolean;
}

import {Column, Entity, ObjectIdColumn} from 'typeorm';
import {v4 as uuid} from 'uuid';

@Entity({ })
export class RatedMatch {
  @ObjectIdColumn({ name: '_id', type: 'string' })
  id: string;
  @Column()
  matchId: string;
  @Column()
  leagueId: string;
  @Column()
  season: string;

  constructor() {
    this.id = uuid();
  }
}

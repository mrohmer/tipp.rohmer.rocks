import {Column, Entity, ObjectIdColumn} from 'typeorm';
import {v4 as uuid} from 'uuid';

@Entity()
export class Tip {
  @ObjectIdColumn({ name: '_id', type: 'string' })
  id: string;
  @Column()
  matchId: string;
  @Column()
  userId: string;
  @Column()
  home: number;
  @Column()
  guest: number;

  constructor() {
    this.id = uuid();
  }
}

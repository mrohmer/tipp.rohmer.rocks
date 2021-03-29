import {Column, Entity, ObjectIdColumn} from 'typeorm';
import {v4 as uuid} from 'uuid';

@Entity()
export class Notification {
  @ObjectIdColumn({ name: '_id', type: 'string' })
  id: string;
  @Column()
  type: 'POINTS_UPDATED';
  @Column()
  payload: object;
  @Column()
  userId: string;

  constructor() {
    this.id = uuid();
  }
}

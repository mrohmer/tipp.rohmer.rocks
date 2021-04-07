import {Column, Entity, ObjectIdColumn} from "typeorm";
import {v4 as uuid} from 'uuid';

@Entity('userGroupConnection')
export class UserGroupConnection {
  @ObjectIdColumn({ name: '_id', type: 'string' })
  id: string;
  @Column()
  userId: string;
  @Column()
  groupId: string;

  constructor() {
    this.id = uuid();
  }
}

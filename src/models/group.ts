import {Column, Entity, getConnection, ObjectIdColumn} from "typeorm";
import {v4 as uuid} from 'uuid';
import {User} from './user';
import {UserGroupConnection} from './user-group-connection';

@Entity('group')
export class Group {
  @ObjectIdColumn({ name: '_id', type: 'string' })
  id: string;
  @Column()
  name: string;
  constructor() {
    this.id = uuid();
  }

  async getUsers(): Promise<User[]> {
    const connections = await getConnection().getRepository(UserGroupConnection).find({
      where: {
        groupId: this.id.toString(),
      }
    });

    if (!connections.length) {
      return [];
    }

    const userIds = connections.map(({userId}) => userId);

    const users = await getConnection().getRepository(User).find();
    return users
      .filter(user => !!user && userIds.includes(user.foreignId));
  }
}

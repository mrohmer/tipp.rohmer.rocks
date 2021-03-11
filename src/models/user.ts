import {Column, Entity, ObjectIdColumn} from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn({ name: '_id', type: 'string' })
  id: string;
  @Column()
  foreignId: string;
  @Column()
  displayName: string;
}

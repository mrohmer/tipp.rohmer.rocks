import type {User} from '../../models/user';

export interface Change {
  difference: number ;
  user: User;
}

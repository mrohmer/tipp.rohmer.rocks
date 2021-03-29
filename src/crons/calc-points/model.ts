import type {Points, User} from '../../models/user';

export interface Change {
  difference: Points;
  user: User;
}

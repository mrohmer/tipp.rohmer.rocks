import type {Connection, Repository} from 'typeorm';
import {getConnection as getDbConnection} from 'typeorm';
import {Tip} from '../../models/tip';
import {User} from '../../models/user';
import {RatedMatch} from '../../models/rated-match';
import {Notification} from '../../models/notification';

let connection: Connection;
let tipRepository: Repository<Tip>;
let userRepository: Repository<User>;
let ratedMatchRepository: Repository<RatedMatch>;
let notificationRepository: Repository<Notification>;

const getConnection = () => {
  if (!connection) {
    connection = getDbConnection();
  }
  return connection;
};
export const getTipRepository = () => {
  if (!tipRepository) {
    tipRepository = getConnection().getRepository(Tip);
  }
  return tipRepository;
}
export const getUserRepository = () => {
  if (!userRepository) {
    userRepository = getConnection().getRepository(User);
  }
  return userRepository;
}
export const getRatedMatchRepository = () => {
  if (!ratedMatchRepository) {
    ratedMatchRepository = getConnection().getRepository(RatedMatch);
  }
  return ratedMatchRepository;
}
export const getNotificationRepository = () => {
  if (!notificationRepository) {
    notificationRepository = getConnection().getRepository(Notification);
  }
  return notificationRepository;
}

import {getConnection} from 'typeorm';
import {Notification} from '../../../models/notification';
import {KickerApiService} from '../../../services/kicker-api.service';
import {environment} from '../../../environments/environment';
import {leagueMap} from '../../../models/kicker/leagues';
import {CaptureSentryError} from '../../../decorators/catch/node';

class Handler {
  @CaptureSentryError()
  static async get(res, req){
    if (environment.production) {
      res.statusCode = 404;
      res.end();
      return;
    }
    const {matchId} = req.query;



    const match = await KickerApiService.getMatchInfo(matchId);

    const leagueKey = Object.keys(leagueMap).find(key => leagueMap[key].id === match.data.match.leagueId)

    const notification = new Notification()
    notification.type = 'REMINDER';
    notification.userId = req.user.id;
    notification.payload = {
      matchId,
      home: match.data.match.homeTeam.shortName,
      guest: match.data.match.guestTeam.shortName,
      date: match.data.match.date,
      league: leagueKey
    };

    await getConnection()
      .getRepository(Notification)
      .save(notification)
    ;

    res.end();
  }
}
export const get = Handler.get

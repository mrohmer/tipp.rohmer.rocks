import {resolveMatch} from '../[matchId].json';
import {getConnection} from 'typeorm';
import {Tip} from '../../../../models/tip';
import {CaptureSentryError} from '../../../../decorators/catch/node';

class Handler {
  @CaptureSentryError()
  static async post(req, res){
    const {leagueName, matchId} = req.params;
    const {home: rawHome, guest: rawGuest} = req.body;

    console.log(req.body);

    if (rawHome === undefined || rawGuest === undefined) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        errors: [{ message: 'Home and/or guest parameters are missing.' }],
      }))
      return;
    }

    const home = parseInt(rawHome);
    const guest = parseInt(rawGuest);

    if (isNaN(home) || isNaN(guest)) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        errors: [{ message: 'Home and guest parameters need to be numbers.' }],
      }))
      return;
    }
    if (home < 0 || guest < 0) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        errors: [{ message: 'Home and guest parameters need to be >= 0.' }],
      }))
      return;
    }

    const match = await resolveMatch(leagueName, matchId);
    if (!match) {
      res.statusCode = 400;
      res.end()
      return;
    }

    if ('results' in match) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        errors: [{ message: 'Game has begun.' }],
      }))
    }

    const repo = getConnection().getRepository(Tip);
    let tip = await repo.findOne({
      where: {
        matchId,
        userId: req.user.id,
      }
    })

    if (!tip) {
      tip = new Tip();
      tip.matchId = matchId;
      tip.userId = req.user.id;
    }

    tip.home = home;
    tip.guest = guest;
    tip.leagueId = match.leagueId;
    tip.season = match.seasonId;

    await repo.save(tip);

    res.end(JSON.stringify(tip));
  }

  @CaptureSentryError()
  static async get(req, res) {
    const {leagueName, matchId} = req.params;

    const match = await resolveMatch(leagueName, matchId);

    if (!match) {
      res.statusCode = 404;
      res.end();
      return;
    }

    const repo = getConnection().getRepository(Tip);
    let tip = await repo.findOne({
      where: {
        matchId,
        userId: req.user.id,
      }
    });

    if (!tip) {
      res.statusCode = 404;
      res.end();
      return;
    }

    res.end(JSON.stringify(tip));
  }

}
export const post = Handler.post
export const get = Handler.get

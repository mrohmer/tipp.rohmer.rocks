import {getDbUser} from '../../utils/user';
import {CaptureSentryError} from '../../decorators/catch/node';

class Handler {
  @CaptureSentryError()
  static async post(req, res){
    const {body} = req;
    const {displayName} = body;

    if (!displayName || typeof displayName !== 'string') {
      res.statusCode = 400;
      res.end(JSON.stringify({
        errors: [{ message: 'DisplayName cannot be empty.' }],
      }))
    }
    if (displayName.length < 3) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        errors: [{ message: 'DisplayName needs to be at least 3 chars long.' }],
      }))
    }
    if (displayName.length > 50) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        errors: [{ message: 'DisplayName needs to be at most 50 chars long.' }],
      }))
    }
    const {repo, user} = await getDbUser(req);

    if (displayName !== user.displayName) {
      user.displayName = displayName;
      await repo.save(user);
    }
    res.end(JSON.stringify(user.getPublic()));
  }
}
export const post = Handler.post

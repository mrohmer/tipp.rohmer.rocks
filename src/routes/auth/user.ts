export const get = (req, res, next) => {
  const { _raw, _json, ...userProfile } = req.user;
  res.end(JSON.stringify(userProfile))
};

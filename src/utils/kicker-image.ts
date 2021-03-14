export const kickerImage = (url: string): string => {
  const defaultMediaHost = 'http://mediadb.kicker.de/'

  if (/^https?:\/\//.test(url)) {
    // host already included
    return url;
  }
  return `${defaultMediaHost}${url}`;
}

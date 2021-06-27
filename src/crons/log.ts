export const log = (name: string, ...messages) => console.log(time(), '[cron]', name, ...messages);
export const error = (name: string, ...messages) => console.error(time(), '[cron]', name, ...messages);

const time = () => {
  const date = new Date();

  return [
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-'),
    [
      String(date.getHours()).padStart(2, '0'),
      String(date.getMinutes()).padStart(2, '0'),
      String(date.getSeconds()).padStart(2, '0'),
    ].join(':')
  ].join(' ')
}

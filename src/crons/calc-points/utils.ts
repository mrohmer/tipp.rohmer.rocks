export const arrayUnique = <T>(arr: T[]): T[] =>
  arr.filter((id, index, arr) => arr.indexOf(id) === index);

import { readdir, stat, Stats } from 'fs';
import { resolve } from 'path';

const pify = <T>(fn) => (...args) =>
  new Promise<T>((resolve, reject) => {
    fn(...args, (err: NodeJS.ErrnoException | null, result: T) => (err ? reject(err) : resolve(result)));
  });

const readDir = pify<string[]>(readdir);

const statPath = pify<Stats>(stat);

export const walk = async (dir: string): Promise<string[]> => {
  let resultList: string[] = [];
  const files = await readDir(dir);
  await Promise.all(
    files.map(async (file) => {
      const resolvedFile = resolve(`${dir}/${file}`);
      const stats = await statPath(resolvedFile);
      if (stats.isDirectory()) {
        const walkResult = await walk(resolvedFile);
        resultList = [...resultList, ...walkResult];
      } else {
        resultList = [...resultList, resolvedFile];
      }
    })
  );
  return resultList;
};

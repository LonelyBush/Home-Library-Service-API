import { stat } from 'fs';

export const getFileSize = (path: string): Promise<number> => {
  return new Promise((resolve) => {
    stat(path, (err, stats) => {
      if (!err && stats) {
        resolve(stats.size / 1000);
      } else {
        resolve(0);
      }
    });
  });
};

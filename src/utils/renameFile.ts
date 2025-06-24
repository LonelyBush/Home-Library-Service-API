import { rename } from 'fs';

export const renameFile = (
  currentNamePath: string,
  nextNamePath: string,
): Promise<boolean> => {
  return new Promise((resolve) => {
    rename(currentNamePath, nextNamePath, (err) => {
      if (!err) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

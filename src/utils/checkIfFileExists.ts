import { access, constants } from 'fs';

export const checkIfFileExists = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    access(path, constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

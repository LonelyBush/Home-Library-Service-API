import { initDb } from 'src/main';

export const getAllUsers = () => {
  return initDb.getAll('Users');
};

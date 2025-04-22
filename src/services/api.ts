
import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'https://api.mock.sb21.ru/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

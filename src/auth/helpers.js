import { getCookie } from '../utils';

const COOKIE_NAME = 'session_key';
const COOKIE_EXP_NAME = 'session_expiration';

export const checkAuth = () => {
  const c = getCookie(COOKIE_NAME);
  const ed = getCookie(COOKIE_EXP_NAME);
  const n = Math.round((new Date()).getTime() / 1000);

  return c && (n < ed);
}


import { getCookie, timestamp } from '../../helpers/utility';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_EXP_NAME } from './constants';

export const getSessionKey = () => getCookie(SESSION_COOKIE_NAME);
export const getSessionExpiration = () => getCookie(SESSION_COOKIE_EXP_NAME);
export const authenticated = () => getSessionKey() && (timestamp() < getSessionExpiration());

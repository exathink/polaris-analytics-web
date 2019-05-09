import { getCookie, timestamp } from '../../helpers/utility';

export const SESSION_COOKIE_NAME = 'session_key';
export const SESSION_COOKIE_EXP_NAME = 'session_expiration';

export const getSessionKey = () => getCookie(SESSION_COOKIE_NAME);
export const getSessionExpiration = () => getCookie(SESSION_COOKIE_EXP_NAME);
export const authenticated = () => getSessionKey() && (timestamp() < getSessionExpiration());

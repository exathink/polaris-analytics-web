export const getCookie = (cookie_name) => {
    const matches = `; ${document.cookie}`.match(`;\\s*${cookie_name}=([^;]+)`);
    return matches ? matches[1] : null;
};

const COOKIE_NAME = 'session_key';
const COOKIE_EXP_NAME = 'session_expiration';

export const checkAuth = () => {
    const cookie = getCookie(COOKIE_NAME);
    const expiry = getCookie(COOKIE_EXP_NAME);
    const now = Math.round((new Date()).getTime() / 1000);

    const authenticated = cookie && (now < expiry);
    console.log("Check Auth: " + authenticated);
    return authenticated;
};
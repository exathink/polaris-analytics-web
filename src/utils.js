export const getCookie = (n) => {
  const c = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
  return c ? c[1] : null;
};

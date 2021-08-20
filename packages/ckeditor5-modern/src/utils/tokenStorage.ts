export const getAccessToken = (): string =>
  localStorage.getItem('access_token') || '';

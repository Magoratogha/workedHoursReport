const getUrl = window.location;
const HOST_API = getUrl .protocol + '//' + getUrl.host;

export const environment = {
  production: true,
  HOST_API
};

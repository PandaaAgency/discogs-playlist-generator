const Authenticator = require('@/services/Authenticator').default;
const HttpService = require('@/services/HttpService').default;

export default (context, inject) => {
  const { store, env, app } = context;

  // authenticator

  const authService = new Authenticator(store);

  authService.addClient('dkt', {
    clientId: env.DKT_CLIENT_ID,
    authorizationUri: env.DKT_AUTHORIZATION_URI,
    redirectUri: env.DKT_REDIRECT_URI,
    authorizationGrants: ['authorization_code'],
    scopes: ['openid']
  });

  authService.addClient('fed', {
    clientId: env.FED_CLIENT_ID,
    authorizationUri: env.FED_AUTHORIZATION_URI,
    redirectUri: env.FED_REDIRECT_URI,
    authorizationGrants: ['authorization_code'],
    scopes: ['openid profile']
  });

  inject('auth', authService);

  // @todo insert api prefix inside env var.
  const httpService = new HttpService(env.API_URL + 'api', store, authService, app.router);
  inject('http', httpService);
};

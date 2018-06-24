const OAuth2Server = require('oauth2-server');
const { Request, Response } = require('oauth2-server');
const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error');
const jwt = require('jsonwebtoken');

const handleError = (ctx, e, response) => {
  if (response) {
    ctx.set(response.headers);
  }

  if (e instanceof UnauthorizedRequestError) {
    ctx.status = e.code;
  } else {
    ctx.body = { error: e.name, error_description: e.message };
    ctx.status = e.code;
  }

  return ctx.app.emit('error', e, ctx);
};

const handleResponse = (ctx, response) => {
  ctx.body = response.body;
  ctx.status = response.status;
  ctx.set(response.headers);
};

const clone = ctx => ({
  request: new Request({
    headers: Object.assign({}, ctx.request.headers || {}),
    method: ctx.request.method,
    query: Object.assign({}, ctx.request.query || {}),
    body: Object.assign({}, ctx.request.body || {}),
  }),
  response: new Response({
    headers: Object.assign({}, ctx.response.headers || {}),
    method: ctx.response.method,
    query: Object.assign({}, ctx.response.query || {}),
    body: Object.assign({}, ctx.response.body || {}),
  }),
});

module.exports = class KoaAdapter {
  constructor(options = {}) {
    this.issuer = options.issuer;
    this.model = options.model;
    this.server = new OAuth2Server({ model: this.model });
  }

  authenticate() {
    return async (ctx, next) => { /* eslint-disable-line */
      try {
        if (ctx.request.body.variables && ctx.request.body.variables.token) {
          /* query client secret and use to verify tokens */
          const token = await this.model
            .getAccessToken(ctx.request.body.variables.token);

          if (token && token.client) {
            const { secret, domain } = token.client;
            const payload = jwt.verify(ctx.request.body.variables.token, secret);

            if (payload.aud === domain) {
              ctx.request.headers.authorization = `Bearer ${ctx.request.body.variables.token}`;
              const { request, response } = clone(ctx);

              ctx.state.oauth = await this.server.authenticate(request, response);
              ctx.state.secret = secret;
            } else {
              throw new UnauthorizedRequestError('Untrusted domain');
            }
          }
        }
      } catch (e) {
        return handleError.call(ctx, e);
      }

      /* if token didn't came from oauth2, send it to the graphql level authentication */
      await next();
    };
  }

  authorize() {
    return async (ctx, next) => { /* eslint-disable-line */
      const { request, response } = clone(ctx);

      try {
        this.state.oauth = {
          code: await this.server.authorize(request, response),
        };

        handleResponse.call(this, ctx, response);
      } catch (e) {
        return handleError.call(this, ctx, e, response);
      }

      await next();
    };
  }

  token() {
    return async (ctx, next) => { /* eslint-disable-line */
      const { request, response } = clone(ctx);

      try {
        ctx.state.oauth = {
          token: await this.server.token(request, response),
        };

        handleResponse.call(this, ctx, response);
      } catch (e) {
        return handleError.call(this, ctx, e, response);
      }

      await next();
    };
  }
};

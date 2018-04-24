const AWS = require('aws-sdk');
const { KoaApplication } = require('flowd-koa');
const { RateLimiter } = require('limiter');
const { Logger } = require('highoutput-utilities');

const Config = require('./../config');

const limiter = new RateLimiter(Config.AWS.rateLimit, 'second');
const logger = new Logger([]);

class RequestApplication extends KoaApplication {
  constructor() {
    super('/email', {
      'POST /': 'sendEmail',
    });
  }

  async sendEmail(ctx) {
    const {
      from, to, subject, cc, bcc, text, html, region,
    } = ctx.request.body;

    limiter.removeTokens(1, (err) => {
      if (err) {
        logger.error(err);
        return;
      }

      const params = {
        Destination: { CcAddresses: cc, ToAddresses: to, BccAddresses: bcc },
        Source: from,
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: html,
            },
            Text: {
              Charset: 'UTF-8',
              Data: text,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      };

      AWS.config.update({ region: region || 'us-east-1' });
      new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail(params)
        .promise()
        .catch(error => logger.error(error));
    });
    ctx.status = 200;
  }
}

module.exports = RequestApplication;

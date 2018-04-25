const AWS = require('aws-sdk');
const throttle = require('p-throttle');
const { KoaApplication } = require('flowd-koa');
const { Logger } = require('highoutput-utilities');
const Config = require('./../config');

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

    const params = {
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

    const throttled = throttle((email) => {
      AWS.config.update({ region: region || 'us-east-1' });
      new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail({
          ...params,
          Destination: { CcAddresses: cc, ToAddresses: [email], BccAddresses: bcc },
        })
        .promise()
        .catch(error => logger.error(error));
    }, Config.AWS.rateLimit, 1000);

    to.forEach(throttled);
    ctx.status = 200;
  }
}

module.exports = RequestApplication;

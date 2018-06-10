const AWS = require('aws-sdk');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const throttle = require('p-throttle');
const fileExists = require('file-exists');
const emailChk = require('email-chk');
const { KoaApplication } = require('flowd-koa');
const { Logger } = require('highoutput-utilities');
const Config = require('./../config');

const logger = new Logger([]);
const TemplateDirectory = Config.TemplateDirectory || path.join(path.dirname(fs.realpathSync(__filename)), './../template');

function getTemplatePath(template) {
  return path.join(TemplateDirectory, `${template.toLowerCase()}.ejs`);
}

class RequestApplication extends KoaApplication {
  constructor() {
    super('/email', {
      'POST /': 'sendEmail',
      'POST /template': 'saveTemplate',
    });
  }

  async sendEmail(ctx) {
    const {
      from, to, subject, cc, bcc, text, checkValidity,
      html, region, template, templateData,
    } = ctx.request.body;

    if (checkValidity) {
      const checkedEmails = await Promise.all(to.map(email =>
        emailChk(email).then(exists => ({ exists, email }))));

      const invalidEmails = checkedEmails.filter(checked => !checked.exists);
      if (invalidEmails.length > 0) {
        ctx.status = 400;
        ctx.body = {
          code: 'INVALID_EMAILS',
          meta: {
            emails: invalidEmails.map(({ email }) => email),
          },
        };
        return;
      }
    }

    if (template && !fileExists(getTemplatePath(template))) {
      ctx.status = 404;
      ctx.body = { code: 'TEMPLATE_NOT_FOUND' };
      return;
    }

    const getHtmlData = (email) => {
      if (!template) {
        return html;
      }

      return ejs.render(
        fs.readFileSync(getTemplatePath(template), { encoding: 'utf8' }),
        { ...templateData, email },
      );
    };

    const throttled = throttle(async (email) => {
      const params = {
        Destination: { CcAddresses: cc, ToAddresses: [email], BccAddresses: bcc },
        Source: from,
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: getHtmlData(email),
            },
            Text: {
              Charset: 'UTF-8',
              Data: template ? getHtmlData() : text,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      };

      AWS.config.update({ region: region || 'us-east-1' });
      return new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail(params)
        .promise()
        .catch(error => logger.error(error));
    }, Config.AWS.rateLimit, 1000);

    to.forEach(throttled);
    ctx.status = 200;
  }

  async saveTemplate(ctx) {
    const { files: { template }, fields: { name } } = ctx.request.body;
    const reader = fs.createReadStream(template.path);
    const writer = fs.createWriteStream(getTemplatePath(name));
    reader.pipe(writer);
    ctx.status = 200;
  }
}

module.exports = RequestApplication;

const fetch = require('node-fetch');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const { URL } = require('url');

const requiredFields = ['from', 'to', 'subject'];

function makeAsArray(arg) {
  return !(Array.isArray(arg)) ? [arg] : arg;
}

function checkFields(param) {
  requiredFields.forEach(field =>
    assert(param[field], `Expected property \`${field}\` to have a value.`));
}

class EmailServiceClient {
  constructor(host, key, region) {
    this.host = host;
    this.key = key;
    this.region = region;
  }

  sendEmail(param) {
    checkFields(param);

    const to = makeAsArray(param.to);
    const cc = makeAsArray(param.cc || []);
    const bcc = makeAsArray(param.bcc || []);

    assert(param.html || param.text || param.template, 'Expected either property `html`, `text`, `template` to be atleast one present.');
    return fetch(`${this.host}/email`, {
      method: 'POST',
      headers: { key: this.key, 'content-type': 'application/json' },
      body: JSON.stringify({
        ...param, to, cc, bcc, region: this.region,
      }),
    });
  }

  async sendEmailVerification(param, secret) {
    checkFields(param);
    const key = jwt.sign({ ...param.payloadData, email: param.to }, secret);
    const templateData = param.templateData || {};

    return this.sendEmail({
      ...param,
      templateData: { ...templateData, key },
    });
  }

  async verify(param, secret) {
    if (typeof param !== 'string' && !param.request && !param.request.search) {
      throw new Error('Parameter expected to be a `string` or `koa` request object.');
    }

    const href = typeof param === 'string' ? param : param.request.href;
    const url = new URL(href);
    const key = url.searchParams.get('key');

    if (!key) {
      return false;
    }

    try {
      return jwt.verify(key, secret);
    } catch (e) {
      return false;
    }
  }
}

module.exports = EmailServiceClient;

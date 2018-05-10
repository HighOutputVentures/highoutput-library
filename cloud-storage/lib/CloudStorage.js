const assert = require('assert');
const isValidPath = require('is-valid-path');
const moment = require('moment');
const ms = require('ms');
const { hmac } = require('highoutput-utilities');
const path = require('path');

const assertObjectKeys = require('./assertObjectKeys');

const MiB = 1048576;
const bucket = 'highoutput-public';

class CloudStorage {
  /**
   * @constructor
   * @param {Object} options
   * @param {string} options.scope
   * @param {string} [options.region]
   * @param {string} options.accessKey
   * @param {string} options.secretKey
   */
  constructor(options) {
    assertObjectKeys(options, ['scope', 'accessKey', 'secretKey']);
    this.scope = options.scope;
    this.region = options.region || 'ap-southeast-1';
    this.secretKey = options.secretKey;
    this.accessKey = options.accessKey;
  }

  /**
   * Get file url and upload info.
   * @param {Object} params
   * @param {string} params.filename
   * @param {string|number} [params.validity]
   * @param {number} [params.upperSizeLimit]
   * @param {number} [params.lowerSizeLimit]
   */
  getUploadCredentials(params) {
    assertObjectKeys(params, ['filename']);

    const {
      validity = '30m',
      upperSizeLimit = 10,
      lowerSizeLimit = 1,
      filename,
    } = params;

    assert(isValidPath(filename), '\'filename\' should be a valid path');
    assert(lowerSizeLimit > 0, '\'lowerSizeLimit\' should be greater than 0');
    assert(upperSizeLimit > lowerSizeLimit, '\'upperSizeLimit\' should be greater than \'lowerSizeLimit\'');
    assert(ms(validity), '\'validity\' should be in ms format, a number or a string');

    const now = moment();
    const date = now.format('YYYYMMDD');
    const xDate = `${date}T000000Z`;
    const key = `${this.scope}/${path.normalize(filename).replace(/^\/+/g, '')}`;
    const credential = `${this.accessKey}/${date}/${this.region}/s3/aws4_request`;

    const msInput = typeof validity === 'string' ? ms(validity) : ms(ms(validity));

    const expiration = now.add(msInput, 'ms').toDate();

    const upperLimit = upperSizeLimit * MiB;
    const lowerLimit = lowerSizeLimit * MiB;

    const policy = Buffer.from(JSON.stringify({
      expiration,
      conditions: [
        { bucket },
        { key },
        { acl: 'public-read' },
        { success_action_status: '201' },
        ['content-length-range', lowerLimit, upperLimit],
        { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
        { 'x-amz-credential': credential },
        { 'x-amz-date': xDate },
      ],
    })).toString('base64');

    const dateKey = hmac(date, `AWS4${this.secretKey}`);
    const dateRegionKey = hmac(this.region, dateKey);
    const dateRegionServiceKey = hmac('s3', dateRegionKey);
    const signingKey = hmac('aws4_request', dateRegionServiceKey);
    const signature = hmac(policy, signingKey);

    const origin = `https://${bucket}.s3.amazonaws.com`;

    return {
      url: `${origin}/${key}`,
      origin,
      params: {
        key,
        acl: 'public-read',
        success_action_status: '201',
        policy,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': credential,
        'x-amz-date': xDate,
        'x-amz-signature': signature.toString('hex'),
      },
    };
  }
}

module.exports = CloudStorage;

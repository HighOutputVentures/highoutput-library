const test = require('ava');
const { AssertionError } = require('assert');
const moment = require('moment');

const helpers = require('./_helpers');

const accessKey = 'AUIBKEA6BBTRMIXXV2IQ';
const secretKey = 'nNUSsvOCNMHnhWi0+Q+V+S5683ZuiWOkTTFIbLfJ';
const scope = 'test-app';
const region = 'ap-southeast-1';
const filename = 'some/path/to/filename.png';

test('Should error on missing parameter scope', (t) => {
  const error = t.throws(() => {
    helpers.instantiate({
      accessKey,
      secretKey,
    });
  }, AssertionError);
  t.is(error.message, '\'scope\' is required');
});

test('Should error on missing parameter accessKey', (t) => {
  const error = t.throws(() => {
    helpers.instantiate({
      scope,
      secretKey,
    });
  }, AssertionError);
  t.is(error.message, '\'accessKey\' is required');
});

test('Should error on missing parameter secretKey', (t) => {
  const error = t.throws(() => {
    helpers.instantiate({
      scope,
      accessKey,
    });
  }, AssertionError);
  t.is(error.message, '\'secretKey\' is required');
});

test('Should instantiate CloudStorage class', (t) => {
  const Storage = helpers.instantiate({
    scope,
    accessKey,
    secretKey,
  });

  t.is(Storage.scope, scope);
  t.is(Storage.accessKey, accessKey);
  t.is(Storage.secretKey, secretKey);
  t.is(Storage.region, region);
});

test('Should error on missing parameter filename', (t) => {
  const Storage = helpers.instantiate({
    scope,
    accessKey,
    secretKey,
  });

  const error = t.throws(() => {
    Storage.getUploadCredentials({});
  }, AssertionError);

  t.is(error.message, '\'filename\' is required');
});

test('Should error on invalid filename', (t) => {
  const Storage = helpers.getInstance();
  const error = t.throws(() => {
    Storage.getUploadCredentials({
      filename: '***2341324',
    });
  }, AssertionError);

  t.is(error.message, '\'filename\' should be a valid path');
});

test('Should error on lowerSizeLimit less than or equal to 0', (t) => {
  const Storage = helpers.getInstance();
  const error = t.throws(() => {
    Storage.getUploadCredentials({
      filename,
      lowerSizeLimit: 0,
    });
  }, AssertionError);

  t.is(error.message, '\'lowerSizeLimit\' should be greater than 0');
});

test('Should error on lowerSizeLimit > upperSizeLimit', (t) => {
  const Storage = helpers.getInstance();
  const error = t.throws(() => {
    Storage.getUploadCredentials({
      filename,
      lowerSizeLimit: 15,
      upperSizeLimit: 8,
    });
  }, AssertionError);

  t.is(error.message, '\'upperSizeLimit\' should be greater than \'lowerSizeLimit\'');
});

test('Should error on invalid ms validity input', (t) => {
  const Storage = helpers.getInstance();
  const error = t.throws(() => {
    Storage.getUploadCredentials({
      filename,
      validity: '2234ssa',
    });
  }, AssertionError);

  t.is(error.message, '\'validity\' should be in ms format, a number or a string');
});

test('Should return upload info', (t) => {
  const Storage = helpers.getInstance();
  const info = Storage.getUploadCredentials({
    filename,
    validity: '30m',
    lowerSizeLimit: 4,
    upperSizeLimit: 20,
  });

  const date = moment().format('YYYYMMDD');
  const expectedCredential = `${Storage.accessKey}/${date}/ap-southeast-1/s3/aws4_request`;
  t.is(info.url, `https://highoutput-public.s3.amazonaws.com/${filename}`);
  t.is(info.params['x-amz-credential'], expectedCredential);
  t.is(info.params['x-amz-date'], `${date}T000000Z`);
});

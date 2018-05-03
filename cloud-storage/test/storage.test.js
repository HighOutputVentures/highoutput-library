const test = require('ava');
const { AssertionError } = require('assert');

const helpers = require('./_helpers');

const accessKey = 'AUIBKEA6BBTRMIXXV2IQ';
const secretKey = 'nNUSsvOCNMHnhWi0+Q+V+S5683ZuiWOkTTFIbLfJ';
const scope = 'test-app';
const region = 'ap-southeast-1';

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
    Storage.getUploadInfo({});
  }, AssertionError);

  t.is(error.message, '\'filename\' is required');
});

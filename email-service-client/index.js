const fetch = require('node-fetch');
const assert = require('assert');

const requiredFields = ['from', 'to', 'subject'];

function makeAsArray(arg) {
  return !(Array.isArray(arg)) ? [arg] : arg;
}

module.exports = (host, key) =>
  async (param) => {
    const to = makeAsArray(param.to);
    const cc = makeAsArray(param.cc || []);
    const bcc = makeAsArray(param.bcc || []);

    requiredFields.forEach(field => assert(`Expected property \`${field}\` to have a value.`));
    assert(param.html || param.text, 'Expected either property `html` or `text` to be atleast present 1.');

    return fetch(`${host}/email`, {
      method: 'POST',
      headers: { key },
      body: JSON.stringify({
        ...param, to, cc, bcc,
      }),
    });
  };

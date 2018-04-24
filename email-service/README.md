# Email Service API
Is a service that is an abstraction of Amazon SES which mainly focuses on sending email.

You need to setup amazon credentials. Please see https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html on how setup on your current machine.

## Send Email [/email]
### POST
To make the request valid, you need to set a `key` in the header that can be found in `config/server.js` property `key`.

**Headers:**
```
  key: ozBn73n4xXtFYyA
```

**Sample Request**
```javascript
{
  "from": "Highoutput Ventures <noreply@highoutput.io>",
  "to": ["djansyledjans@gmail.com"],
  "subject": "hello world",
  "html": "<b>Hello world</b><a href='#'>Test</a>",
  "text": "good eve",
  "cc": ["chestine_jans@yahoo.com"],
  "bcc": ["chestine_jans@yahoo.com"]
}
```
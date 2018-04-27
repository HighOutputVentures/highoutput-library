# Highoutput Email Service Client

## Class:Client
### Constructor:new Client(host, secret)
Creates an email service client for the specific host and it's secret.

### sendEmail(param) `<Promise>`
* param `<Object>`
  * from `<String>` **required** Email of the sender
  * to `<String>|<Array<String>>` **required** Email(s) of the recipient(s)
  * text `<String>` Text content
  * html `<String>` Html content
  * bcc `<String>|<Array<String>>`
  * cc `<String>|<Array<String>>`
  * template `<String>` Name of the template
  * templateData `<Object>` Object data to be bound to the template

Though `text`, `html`, or `template` property is not required, but one of them must be present.

```javascript
  sendEmail({
    from: "Highoutput Ventures <noreply@highoutput.io>",
    to: ["djansyledjans@gmail.com"],
    subject: "hello world",
    html: "<b>Hello world</b><a href='#'>Test</a>",
    text: "good eve",
    cc: ["chestine_jans@yahoo.com"],
    bcc: ["chestine_jans@yahoo.com"]
  });
```

### sendEmailVerification(param, secret) `<Promise>`
Acts same like a send email but also includes a `key` data that is being included in `templateData`.
It also adds a new optional property which is a `payloadData` other information you wanted to include upon verifying.

```javascript
  client.verify({
    to: 'djansyledjans@gmail.com',
    from: 'High Output Ventures <noreply@highoutput.io>',
    template: 'verify',
    templateData: { name: 'djansyle' },
    payloadData: { id: 'f64f2940-fae4-11e7-8c5f-ef356f279131'},
    subject: 'One more step',
  }, 'supersecretkey').then(() => console.log('sent'));
```

### verify(param, secret) <Promise>
Verifies the parameter it can be a `string` of the plain link or koa `ctx`.

```javascript
  client.verify('http://localhost:8080?key=averylongvalidkey','supersecretkey');
  // Outputs:
  // { email: 'djansyledjans@gmail.com', id: 'f64f2940-fae4-11e7-8c5f-ef356f279131' iat: 1524793969 }
```

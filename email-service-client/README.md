# Highoutput Email Service Client

## client(host) `<Function<Promise>>`
Creates a email service client for the specific host.

```javascript
const sendEmail = client('http://localhost:8080', 'mysupersecretkeythatnooneknows');
```

### sendEmail(param) `<Promise>`
* param `<Object>`
  * from `<String>` **required** Email of the sender
  * to `<String>|<Array<String>>` **required** Email(s) of the recipient(s)
  * text `<String>` Text content
  * html `<String>` Html content
  * bcc `<String>|<Array<String>>`
  * cc `<String>|<Array<String>>`

Though `text` and `html` property is not required, but one of them must be present.

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
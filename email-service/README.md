# Email Service API
Is a service that is an abstraction of Amazon SES which mainly focuses on sending email.

You need to setup amazon credentials. Please see https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html on how setup on your current machine.

## Send Email [/email]
### POST
To make the request valid, you need to set a `key` in the header that can be found in `config/server.js` property `key`.
** Request **
| Property | Data Type | Required | Description | Default Value |
| --- | --- | --- | --- | --- |
| from | `<String>` | true | Verified email from amazon SES |  |
| to | `<Array<String>> ` | true | Recipient(s) address |  |
| subject | `<String>` | true | Subject of the email |  |
| html | `<String>` | false | HTML message |  |
| text | `<String>` | false | Plain text message (for fallback) |  |
| cc | `<Array<String>>` | false |  |  |
| bcc | `<Array<String>>` | false |  |  |
| region | `<String>` | true | Region to be used of the amazon SES for sending the email | us-east-1 |
| checkValidity | `<Boolean>` | false | Determine whether to check first all the email if those email(s) exists of the domain SMTP server | false |

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

## Send Template [/email/template]
Email template must be in ejs format.

### POST
Upload a new template with the given `name` and the `template` itself. It's also possible to use `include` in ejs template files with the `name` of the referred template. Template file must be in `form-data` that compose of 2 keys namely the `name` which will represent the name of the template and the `template` which is the ejs file to be uploaded.

```
curl -X POST -F template=@./header.ejs -F name=header http://localhost:8080/email/template
```

You can then make a request that uses template.
```javascript
{
  "from": "Highoutput Ventures <noreply@highoutput.io>",
  "to": ["djansyledjans@gmail.com"],
  "subject": "hello world",
  "template": "header",
  "templateData": { "brand": "highoutput ventures" },
  "cc": ["chestine_jans@yahoo.com"],
  "bcc": ["chestine_jans@yahoo.com"]
}
```

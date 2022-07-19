# `support`

> TODO: description

## Usage

```ts
import { SupportServer } from '@highoutput-library/support';

const app = express();

const supportServer = new SupportServer({
  notionDatabaseId: faker.git.commitSha(),
  notionAccessToken: faker.git.commitSha(),
  prefix: '/support',
  project: 'HER',
});

app.use(supportServer.expressMiddleware());

app.listen(8080);
```

`Add support message to notion`

```json
// POST localhost:8080/support/messages

{
  "emailAddress": "alres.arena2019@gmail.com",
  "message": "this is a test message",
  "details": {
    "customerName": "alres arena",
    "name": "alres arena",
    "category": "others",
  },
}
```

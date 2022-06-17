# `@highoutput/object-id`

> Generate unique ids

## Usage

```
import { ObjectId } from '@highoutput/object-id';

enum ObjectType = {
  User = 0,
  Post = 1,
}

const id = new ObjectId(ObjectType.User);

console.log(id.toString());
```

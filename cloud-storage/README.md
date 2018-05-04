# Cloud Storage

## Class: **CloudStorage**

### **new CloudStorage(options)**
* **options.scope** `string` Scope in the single bucket where the file is going to be stored. This should be equivalent to your app name.
* **options.region?** `string` Specified region. Default value is `'ap-southeast-1'`.
* **options.accessKey** `string` AWS Access Key ID.
* **options.secretKey** `string` AWS Secret Access Key.

#### Example
```javascript
import CloudStorage from 'highoutput-cloud-storage';

const storage = new CloudStorage({
  scope: 'my-app-name',
  accessKey: 'AKIAIOSFODNN7EXAMPLE',
  secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
});
```

### **storage.getUploadCredentials(params)**
* **params.filename** `string` Filename (with path). Value will be normalized and leading `'/'` will be removed.
* **params.validity?** `string|number` Time validity of credential. Input should be following `ms` module format.
* **params.upperSizeLimit?** `number` Upper file size limit to be uploaded in MB. Deafult value is `10`.
* **params.lowerSizeLimit?** `number` Lower file size limit to be uploaded in MB. Should be greater than `0` and lesser than `upperSizeLimit`. Default value is `1`.

#### Example
```javascript
const info = storage.getUploadCredentials({
  filename: 'some/filename.js',
});

console.log(info);
// {
//   url: 'https://highoutput-public.s3.amazonaws.com/my-app-name/some/filename.js',
//   params: {
//     key: 'my-app-name/some/filename.js',
//     acl: 'public-read',
//     success_action_status: '201',
//     policy: 'eyJleHBpcmF0aW9uIjoiMjAxOC0wNS0wNFQwMzoxMTo1Ni44NTBaIiwiY29uZG==',
//     'x-amz-algorithm': 'AWS4-HMAC-SHA256',
//     'x-amz-credential': 'AKIAIOSFODNN7EXAMPLE/20180504/ap-southeast-1/s3/aws4_request',
//     'x-amz-date': '20180504T000000Z',
//     'x-amz-signature': '758f600aac46de0bcf68e1fb47e0646afa7c306c5006a8'
//   }
// }
```

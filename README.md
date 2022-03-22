# Etisalcom SMS

etisalcom SMS integration module uses `HTTP` to communicate with service providers.

***

## Usage

```javascript

import etisalcomSms from "@bawq/etisalcom-sms";

const smsSender = new etisalcomSMS({
    accountSid: "<SID>",
    authToken: "<PASSWORD>",
    from: '<FROM>'
})

smsSender.send({
    to: "<NUMBER>",
    body: "hi from etisalcom",

}).then((result) => {
    console.log(result)
}).catch((err) => {
    console.log(err)
});
```

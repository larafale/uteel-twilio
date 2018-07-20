# Twilio sender

## Usage

```js
import Twilio from 'uteel-twilio'


const sms = Twilio({

  // twilio credentials
    creds: {
        sid: process.env.TWILIO_SID
      , token: process.env.TWILIO_TOKEN
    }

  // depending on countries, alphanumeric senders are not supported (eg: us)
  , senders: {
        'fr': 'Acme Corp'
      , 'us': '+14152026692'
    }

  // templates can also be an url to fetch from
  , templates: {
      "signup": {
          "en": { "body": "Hello {{name}}" }
        , "fr": { "body": "Bonjour {{name}}" }
      }
    }

  // receivers numbers are overrided by this number.
  , forceTo: '+336......'

  // if mock is true, final twilio request is not executed
  , mock: process.env.SMS != 'true'

  // provide your custom logger
  , log: (namespace, message, meta) => {
      console.log(`[${namespace}] ${message}`, meta)
    }

  // transform sms message before sending
  , transform: msg => {
      return process.env.NODE_ENV != 'production' 
        ? `[${process.env.NODE_ENV}] ${msg}` 
        : msg
    }

})
```


Once you initiated your sms handler, sending a text is as easy as:

```js
const result = await sms.send('signup', '+33608022073', { name: 'batman' })
```

## info

- Append a dot "." at the end of an url in order to disable link preview in sms app (ios for exemple)



## Test numbers

How To Use Twilio Test Credentials with Magic Phone Numbers
Magic Phone Number  Description Error Code

```
+15005550000  This phone number is unavailable. 21422
+15005550001  This phone number is invalid. 21421
+15005550006  This phone number is valid and available. No error
```
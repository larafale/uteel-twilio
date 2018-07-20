import Twilio from '../source'
  console.log('oo', process.env.NODE_ENV)

const sms = Twilio({

  // twilio credentials
    creds: {
        sid: process.env.TWILIO_SID||'ii'
      , token: process.env.TWILIO_TOKEN||'oo'
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
  , forceTo: '+33608022073'

  // if mock is true, final twilio request is not executed
  , mock: false

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

const test = async () => {
  // const location1 = await geocode('1060 West Addison Street')
  // const location2 = await geocode('43.5262719, 5.4484675')
  
}

test()




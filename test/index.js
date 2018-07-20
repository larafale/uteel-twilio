import Twilio from '../source'
import assert from 'assert'


const sms = Twilio({

  // twilio credentials
    creds: {
        sid: process.env.TWILIO_SID||'AC112a94fceab3288fd5d91a95629ce679'
      , token: process.env.TWILIO_TOKEN||'649df7667f93e67f0a13192246dc3156'
    }

  // depending on countries, alphanumeric senders are not supported (eg: us)
  , senders: {
        'fr': '+15005550006' // twilio test number
      // , 'us': '+14152026692'
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
      return `[npm test] ${msg}`
    }

})

const test1 = async () => {

  const template = {
      body:'Hello {{name}}'
    , subs: { name: 'batman' } 
  }

  const result = await sms.send(template, '+33608022073')
  console.log('[sms] result', result)
  assert(result.response.sid, 'no sid returned')
  assert(result.response.status == 'queued')
}

const test2 = async () => {
  const result = await sms.template('signup:fr', '+33608022073', { name: 'batman' })
  console.log('[sms] result', result)
  assert(result.response.sid, 'no sid returned')
  assert(result.response.status == 'queued')
}

test1()
setTimeout(()=>{}, 3000)




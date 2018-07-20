import Sender from 'uteel-sender'
import Twilio from 'twilio'
import _ from 'lodash'
import { parseNumber, formatNumber, AsYouType } from 'libphonenumber-js'
import { decodeHTMLEntities } from './utils'



export default options => {

  const $twilio = new Twilio(
    options.creds.sid, 
    options.creds.token
  )
  
  const handler = async (template, to, subs, { renderKeys }) => {
    subs = template.subs || subs // merge additonal subs from initTemplate()

    // interpolate some template keys
    template = { ...template, ...renderKeys(template, subs, ['body']) }

    // prepare tos
    let tos = []
    if(Array.isArray(to)) tos = to
    if(typeof to === 'function') tos = to(template)
    if(typeof to === 'string') tos = to.split(',')

    // prepare forceTo
    options.forceTo = options.forceTo && typeof options.forceTo == 'string' 
      ? options.forceTo.split(',') 
      : options.forceTo || []

    // init ctx
    const ctx = {
      error: false, 
      request: { to, template },
      response: false
    }

    // decode html entities
    template.body = decodeHTMLEntities(template.body)

    // transform message
    if(options.transform) template.body = options.transform(template.body)

    // logs
    const meta = {
        tpl: `${subs._tpl && subs._tpl.key}`
      , text: template.body
      , mock: !!options.mock
      , tos: tos
      , force: options.forceTo
    }

    if(options.log) options.log(`sms`, `process sms`, meta)


    // overide with forceTo (place afet logs)
    if(options.forceTo.length) tos = options.forceTo


    // mock
    if(options.mock) {
      ctx.mocked = true
      return ctx
    }


    const catchError = err => {
      console.log('[err:twilio]', err)
      ctx.error = true
      ctx.response = err
      return ctx
    }

    try {

      const phoneTarget = tos[0]
      const phoneCountry = ((parseNumber(phoneTarget)).country||'').toLowerCase()
      const sender = options.senders[phoneCountry]

      if(!sender) return catchError(`phone "${phoneTarget}" with country "${phoneCountry}" is not supported in "options.senders" list.`)

      return $twilio.messages.create({
        body: template.body,
        to: tos[0],
        from: sender
      }).then(res => {
        ctx.phoneCountry = phoneCountry
        ctx.response = _.pick(res, ['body', 'sid', 'status'])
        return ctx
      }).catch(err => {
        return catchError(err)
      })
    }catch(e){
      return catchError(e)
    }

  }

  const initTemplate = async (name, subs, { fetchJson }) => {
    try {
      const [key, lang] = name.split(':')

      const template = (typeof options.templates == 'string'
        // if( string thn it's a url)
        ? (await fetchJson(options.templates))
        : options.templates
      )[key][lang]

      // pass down enhanced subs
      template.subs = { ...subs, _tpl: { key, lang }}

      return template
    }catch(e){
      throw new Error(`unable to fetch template "${name}"`)
    }
  }

  const Instance = Sender(handler, initTemplate)

  Instance.setOptions = opts => {
    options = { ...options, ...opts }
  }

  return Instance
}


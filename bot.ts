import LUISClient                    from 'luis-sdk'
import { generate                  } from 'qrcode-terminal'
import { Contact, Message, Wechaty } from 'wechaty'
import { PuppetPadplus             } from 'wechaty-puppet-padplus'

/**
 * Config wechaty, see: https://github.com/chatie/wechaty
 */
const token = 'puppet_padplus_f9a4033a7b2f8894'
// const puppet = 'wechaty-puppet-padchat'
// const puppetOptions = {
//   token: WECHATY_PUPPET_PADPLUS_TOKEN,
// }

const puppet = new PuppetPadplus({
  token,
})

const bot = new Wechaty({
  name: 'lijiarui',
  puppet,
})

/**
 * Config Luis, see: www.luis.ai
 */
const APPID = '841b05a2-bebf-4b94-a82a-85236679687e'
const APPKEY = '7dbf6405b5154fbca1a8cce9363feab8'
const DOMAIN = 'westus.api.cognitive.microsoft.com'
const LUISclient = LUISClient({
  appId   : APPID,
  appKey  : APPKEY,
  domain  : DOMAIN,
  verbose : false,
})

/**
 * Bot Action
 */
bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))

function onScan (qrcode: string) {
  generate(qrcode, { small: true })  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

function onLogin (user: Contact) {
  console.log(`${user} login`)
}

function onLogout (user: Contact) {
  console.log(`${user} logout`)
}

/**
 * Using Luis to deal with message
 */
async function onMessage (msg: Message) {
  const text = msg.text()
  const type = msg.type()
  const room = msg.room()

  if (msg.self()) {
    return
  }

  if (room) {
    return
  }

  if (type !== Message.Type.Text) {
    return
  }

  console.log(msg.toString())

  LUISclient.predict(text, {

    // On success of prediction
    onSuccess: async (response) => {
      console.log(JSON.stringify(response))
      if (response.topScoringIntent.intent === 'Weather.CheckWeatherTime') {
        await msg.say('意图为：根据天气查询时间')
      } else if (response.topScoringIntent.intent === 'Weather.CheckWeatherValue') {
        await msg.say('意图为：根据时间地点查询天气')
      } else if (response.topScoringIntent.intent === 'Weather.QueryWeather') {
        await msg.say('意图为：确认天气')
      } else {
        await msg.say('你没有触发任何意图')
      }

      if (response.entities.length > 0) {
        await msg.say('触发的实体信息为:')
        for (let i = 1; i <= response.entities.length; i++) {
          await msg.say(i + '- ' + response.entities[i - 1].entity)
        }
      }
    },

    // On failure of prediction
    onFailure: (err: undefined | Error) => {
      console.error(err)
    }
  })
}

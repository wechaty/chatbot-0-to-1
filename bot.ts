import LUISClient                    from 'luis-sdk'
import { generate                  } from 'qrcode-terminal'
import { Contact, Message, Wechaty } from 'wechaty'

const bot = new Wechaty({
  name: 'lijiarui',
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
  const contact = msg.from()

  if (msg.self()) {
    return
  }

  if (!contact) {
    return
  }

  if (type !== Message.Type.Text) {
    return
  }

  console.log(msg.toString())

  if (room) {
    const topic = await room.topic()
    if (topic === 'test') {
      LUISclient.predict(text, {

        // On success of prediction
        onSuccess: async (response) => {
          console.log(JSON.stringify(response))
          if (!response.topScoringIntent) {
            return
          }

          if (response.topScoringIntent.intent === 'Weather.CheckWeatherTime') {
            await room.say('意图为：根据天气查询时间', contact)
          } else if (response.topScoringIntent.intent === 'Weather.CheckWeatherValue') {
            await room.say('意图为：根据时间地点查询天气', contact)
          } else if (response.topScoringIntent.intent === 'Weather.QueryWeather') {
            await room.say('意图为：确认天气', contact)
          } else {
            await room.say('你没有触发任何意图', contact)
          }

          if (response.entities.length > 0) {
            await room.say('触发的实体信息为:', contact)
            for (let i = 1; i <= response.entities.length; i++) {
              await room.say(i + '- ' + response.entities[i - 1].entity, contact)
            }
          }
        },

        // On failure of prediction
        onFailure: (err: undefined | Error) => {
          console.error(err)
        }
      })
    }
    return
  }
}

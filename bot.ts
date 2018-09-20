import { Wechaty, Contact, Message } from 'wechaty'

const WECHATY_PUPPET_PADCHAT_TOKEN = 'puppet_padchat_579a8b3a5707e433'

const puppet = 'wechaty-puppet-padchat'
const puppetOptions = {
  token: WECHATY_PUPPET_PADCHAT_TOKEN,
}

const bot = new Wechaty({
  puppet,
  puppetOptions,
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))

function onScan (qrcode: string) {
  require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

function onLogin (user: Contact) {
  console.log(`${user} login`)
}

function onLogout(user: Contact) {
  console.log(`${user} logout`)
}

async function onMessage (msg: Message) {
  console.log(msg.toString())
}

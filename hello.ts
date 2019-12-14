import { Wechaty, ScanStatus } from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import { generate } from 'qrcode-terminal'

const token = 'puppet_padplus_60f66b0736a69a7b'

const puppet = new PuppetPadplus({
  token,
})

const bot = Wechaty.instance({
  puppet,
}) // Global Instance

bot
.on('scan', (qrcode, status) => {
  generate(qrcode)  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log('StarterBot', '%s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  // console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
})
.on('login',            user => console.log(`User ${user} logined`))
.start()
.catch((e: Error) => console.error(e))

bot.on('message', async message => {
  console.log(`Message: ${message}`)

  if (message.self()) {
    return
  }

  if (message.room()) {
    return
  }

  const text = message.text()
  if (text === 'ding') {
    await message.say('dong')
  }
})

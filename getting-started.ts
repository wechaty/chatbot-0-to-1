/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
import {
  Contact,
  Message,
  ScanStatus,
  Wechaty,
}               from 'wechaty'

import { generate } from 'qrcode-terminal'

const bot = new Wechaty({ name: 'lijiarui' })

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => console.log('StarterBot', 'Starter Bot Started.'))
  .catch(e => console.error('StarterBot', e))

function onScan (qrcode: string, status: ScanStatus) {
  generate(qrcode)  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log('StarterBot', '%s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
}

function onLogin (user: Contact) {
  console.log('StarterBot', '%s login', user)
}

function onLogout (user: Contact) {
  console.log('StarterBot', '%s logout', user)
}

async function onMessage (msg: Message) {
  const contact = msg.from()
  console.log('StarterBot', msg.toString())

  if (msg.self()) {
    return
  }

  if (!contact) {
    return
  }

  const room = msg.room()

  if (room) {
    const topic = await room.topic()
    if (topic === 'test') {
      if (msg.text().toLowerCase() === 'ding') {
        await room.say('dong', contact)
      }
    }
    return
  }
}

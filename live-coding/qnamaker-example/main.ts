import {
  Message,
  UrlLink,
  Wechaty,
} from 'wechaty'

import {
  EventLogger,
  QRCodeTerminal,
} from 'wechaty-plugin-contrib'

import { simpleQnAMaker } from 'simple-qnamaker'

const qa = simpleQnAMaker({
  endpointKey: '581d6ea4-ef01-4d43-b146-4d2968cfd8e3',
  host: 'https://wechatyqnachinese.azurewebsites.net/qnamaker',
  knowledgeBaseId: '3e9478cd-555c-47d1-9f4d-27452d8ce0b7',
})

const bot = new Wechaty({
  name: 'azure-show',
  puppet: 'wechaty-puppet-hostie',
  puppetOptions: { token: 'puppet_wxwork_4cadbf52f03040f8' },
})

bot.start()
  .then(() => console.log('bot started'))
  .catch(e => console.log('error', e))

bot.use(EventLogger())
bot.use(QRCodeTerminal())

bot.on('message', onMessage)

async function onMessage (msg: Message) {
  console.log(`${msg.toString()}`)

  const room = msg.room()

  if (room && (await msg.mentionSelf())) {
    // await jiaruiBot(msg)
    return
  }

  if (!room) {
    await jiaruiBot(msg)
    return
  }
}

export async function jiaruiBot (msg: Message) {
  console.log('begin to use jiaruiBot')
  // use qnamaker to answer common questions
  await qnamaker(msg)
}

async function qnamaker (msg: Message) {
  const text = msg.text()

  const answer = await qa(text)
  console.log(answer)

  if (answer.length > 0) {
    if (answer[0].answer === '李佳芮') {
      const intro = '李佳芮，句子互动创始人，连续创业者，微软人工智能最有价值专家（AI MVP），GitHub 7000+ Stars开源项目Wechaty作者，创建并管理了覆盖全球的微信聊天机器人开发者社区，《Chatbot从0到1：对话式交互设计指南》作者。'

      const urlLink = new UrlLink({
        description: '句子互动创始人 & CEO，连续创业者，《Chatbot 从0到1》作者，微软人工智能最具价值专家 (AI MVP)',
        thumbnailUrl: 'https://pre-angel.com/assets/peoples/jiarui-li/avatar.png',
        title: '李佳芮',
        url: 'https://pre-angel.com/peoples/jiarui-li/',
      })

      await msg.say(intro)
      await msg.say('更多详细信息请点击链接：')
      await msg.say(urlLink)

      return
    }
    await msg.say(answer[0].answer)
  } else {
    await msg.say('很抱歉，我没有听懂，请联系我的老板李佳芮')
  }
}

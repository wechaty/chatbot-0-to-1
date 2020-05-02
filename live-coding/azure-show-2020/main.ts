import {
  Contact,
  FileBox,
  Message,
  UrlLink,
  Wechaty,
                        } from 'wechaty'

import { generate       } from 'qrcode-terminal'

import { simpleQnAMaker } from 'simple-qnamaker'

const qa = simpleQnAMaker({
  endpointKey     : 'bc138303-260a-42fa-b4d4-3d69db88922d',
  host            : 'https://juzibot-investment.azurewebsites.net/qnamaker',
  knowledgeBaseId : '51762d0d-96b0-4888-82f3-a0230bbb8b3d',
})

const bot = new Wechaty({
  name          : 'azure-show',
  puppet        : 'wechaty-puppet-padplus',
  puppetOptions : { token: 'puppet_padplus_XXXXX' },
})

bot.start()
  .then(()  => console.log('bot started'))
  .catch( e => console.log('error', e))

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

function onScan (qrcode: string) {
  generate(qrcode, { small: true })
}

function onLogin (user: Contact) {
  console.log(`${user} login`)
}

function onLogout (user: Contact) {
  console.log(`${user} logout`)
}

async function onMessage (msg: Message) {
  console.log(`${msg.toString()}`)

  if (msg.self()) {
    return
  }

  const room = msg.room()

  if (room && await msg.mentionSelf()) {
    await jiaruiBot(msg)
    return
  }

  if (!room) {
    await jiaruiBot(msg)
    return
  }
}

async function jiaruiBot (msg: Message) {
  console.log('begin to use jiaruiBot')
  const text = msg.text()

  // introduce juzibot
  if (/句子互动/.test(text)) {
    const intro = `句子互动围绕微信生态为客户提供智能营销和销售服务，帮助企业引流并实现转化，客户覆盖教育、保险、大健康等多个领域。获得PreAngel、Plug and Play，Y Combination, TSVC和阿尔法公社多家中美机构投资。曾入选百度AI加速器和 Facebook 大陆首期加速器`
    const companyLink = new UrlLink({
      description  : 'Salesforce for Social Network，专业的微信生态 SCRM 提供商，YC China 首期入选创业公司 (YC W19)',
      thumbnailUrl : 'https://pre-angel.com/assets/portfolios/juzibot/icon.png',
      title        : '句子互动',
      url          : 'https://pre-angel.com/portfolios/juzibot/',
    })

    await msg.say(intro)
    await msg.say('更多详细信息可以查看：')
    await msg.say(companyLink)

    return
  }

  // introduce lijiarui
  if (/李佳芮/.test(text)) {
    const intro = `李佳芮，句子互动创始人，连续创业者，微软人工智能最有价值专家（AI MVP），GitHub 7000+ Stars开源项目Wechaty作者，创建并管理了覆盖全球的微信聊天机器人开发者社区，《Chatbot从0到1：对话式交互设计指南》作者。`
    const lijiaruiLink = new UrlLink({
      description  : '句子互动创始人 & CEO，连续创业者，《Chatbot 从0到1》作者，微软人工智能最具价值专家 (AI MVP)',
      thumbnailUrl : 'https://pre-angel.com/assets/peoples/jiarui-li/avatar.png',
      title        : '李佳芮',
      url          : 'https://pre-angel.com/peoples/jiarui-li/',
    })

    await msg.say(intro)
    await msg.say('更多详细信息可以查看：')
    await msg.say(lijiaruiLink)

    return
  }

  // introduce product
  if (/产品介绍/.test(text)) {
    const productLink = 'https://s3.cn-north-1.amazonaws.com.cn/xiaoju-material/public/rc-upload-1588329077509-2_1588329107373_juzi-wechat-work.pdf'
    const videoLink   = 'https://s3.cn-northwest-1.amazonaws.com.cn/xiaoju-message-payload-bucket/message/5eabfde2902dac007ce66162/1588330824050/5943444666822877866_wxid_5zj4i5htp9ih22_1588330818028_.mp4'

    await msg.say(FileBox.fromUrl(productLink, '句子互动企业微信SCRM产品介绍.pdf'))
    await msg.say('这是我们的产品演示视频')
    await msg.say(FileBox.fromUrl(videoLink))

    return
  }

  // ask valuation
  await qnamaker(text, msg)
}

async function qnamaker (text: string, msg: Message) {
  console.log('begin call qnamaker')
  const answer = await qa(text)

  console.log(answer)

  if (answer.length > 0) {
    await msg.say(answer[0].answer)
  } else {
    await msg.say('很抱歉，我没有理解那你的意思，有问题可以联系我的老板李佳芮~ ')
    const lijiarui = msg.wechaty.Contact.load('qq512436430')
    await msg.say(lijiarui)
  }
}

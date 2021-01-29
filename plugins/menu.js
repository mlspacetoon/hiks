let fs = require ('fs')
let path = require('path')
let handler  = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')))
    let exp = global.DATABASE.data.users[m.sender].exp
    let limit = global.DATABASE.data.users[m.sender].limit
    let name = conn.getName(m.sender)
    let d = new Date
    let locale = 'id'
    let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
    let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.DATABASE._data.users).length
    let tags = {
      'main': '𝐌𝐚𝐢𝐧',
      'info': '𝐈𝐧𝐟𝐨',
      'about': '𝐀𝐛𝐨𝐮𝐭',
      'xp': '𝐄𝐱𝐩 & 𝐋𝐢𝐦𝐢𝐭',
      'sticker': '𝐌𝐚𝐤𝐞𝐫',
      'kerang': '𝐊𝐞𝐫𝐚𝐧𝐠',
      'quotes': '𝐐𝐮𝐨𝐭𝐞𝐬',
      'admin': '𝐀𝐝𝐦𝐢𝐧',
      'group': '𝐆𝐫𝐨𝐮𝐩',
      'internet': '𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠',
      'downloader': '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫',
      'tools': '𝐓𝐨𝐨𝐥𝐬',
      'jadibot': '𝐔𝐬𝐞 𝐁𝐨𝐭',
      'owner': '𝐎𝐰𝐧𝐞𝐫',
      'host': '𝐇𝐨𝐬𝐭',
      'advanced': '𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝',
      '': 'Next Update Wait..',
    }
    for (let plugin of Object.values(global.plugins))
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!tag in  tags) tags[tag] = tag
    let help = Object.values(global.plugins).map(plugin => {
      return {
        help: plugin.help,
        tags: plugin.tags,
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag))
          if (menu.help) groups[tag].push(menu)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || `
╭───── ⚘ {conn.getName(conn.user.jid)} ⚘
│⚘ Haee, %name  ᥬ😳᭄
│
│⚘ XP: *%exp XP*
│⚘ Limit: *%limit*
│
│⚘ Tanggal: *%week , %date*
│⚘ Jam: *%time*
│
│⚘ Bot Active: *%uptime*
│⚘ Database User: %totalreg nomor
│
╰──────────────
%readmore`
    let header = conn.menu.header || '╭────❍` %category'
    let body   = conn.menu.body   || '│ ⚘ %cmd%islimit'
    let footer = conn.menu.footer || '╰─────────────ᜰ\n'
    let after  = conn.menu.after  || (conn.user.jid == global.conn.user.jid ? '' : `by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + `\n*%npmname@^%version*\n\`\`\`\%npmdesc\`\`\``
    let _text  = before + '\n'
    for (let tag in groups) {
      _text += header.replace(/%category/g, tags[tag]) + '\n'
      for (let menu of groups[tag]) {
        for (let help of menu.help)
          _text += body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? ' (Limit)' : '')  + '\n'
      }
      _text += footer + '\n'
    }
    _text += after
    text =  typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      exp, limit, name, weton, week, date, time, totalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).join`|`})`, 'g'), (_, name) => replace[name])
    conn.reply(m.chat, text.trim(), m)
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu','help','?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 5

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}

import { NextRequest, NextResponse } from 'next/server'

// Same Telegram chat, different bot prefix so it's easy to distinguish
const CHAT_ID = '-1004300029409'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, attending, notes } = data

    const lines = [
      '🤍 *Artem & Galinka — нова відповідь*',
      '',
      `👤 *Імʼя:* ${name}`,
      `✅ *Присутність:* ${attending}`,
    ]
    if (notes?.trim()) lines.push(`💬 *Побажання:* ${notes}`)

    const token = process.env.BOT_TOKEN
    if (token) {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: lines.join('\n'), parse_mode: 'Markdown' }),
      })
      const json = await res.json()
      if (!json.ok) console.error('[TG AG error]', json)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[RSVP-AG error]', err)
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

const CHAT_ID = '-1003936464185'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const { name, attending, accommodation, accommodationNight } = data

    const lines = [
      '🌿 *Нове підтвердження присутності*',
      '',
      `👤 *Імʼя:* ${name}`,
      `✅ *Присутність:* ${attending}`,
      `🏨 *Ночівля:* ${accommodation}`,
    ]

    if (accommodation?.startsWith('Так') && accommodationNight) {
      lines.push(`🌙 *Ніч:* ${accommodationNight}`)
    }

    const text = lines.join('\n')

    const token = process.env.BOT_TOKEN
    if (!token) {
      console.error('BOT_TOKEN is not set')
      return NextResponse.json({ ok: false, error: 'Bot token missing' }, { status: 500 })
    }

    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    )

    const tgJson = await tgRes.json()

    if (!tgJson.ok) {
      console.error('[TG error]', tgJson)
      return NextResponse.json({ ok: false, error: tgJson.description }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[RSVP error]', err)
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

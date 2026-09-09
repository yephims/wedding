import { NextRequest, NextResponse } from 'next/server'

const CHAT_ID = '-1003936464185'
const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbxThGN9plGQOTjVHWhq6C3vrNP63aONTA7ORTxRxqdcAAeo9fBclMFrCf8cJddmR8_8ag/exec'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, attending, accommodation, nightStart, nightEnd } = data

    // ── 1. Telegram ──────────────────────────────────────────
    const lines = [
      '🌿 *Нове підтвердження присутності*',
      '',
      `👤 *Імʼя:* ${name}`,
      `✅ *Присутність:* ${attending}`,
      `🏨 *Ночівля:* ${accommodation}`,
    ]
    if (accommodation?.startsWith('Так') && nightStart) {
      lines.push(`📅 *З:* ${nightStart}`)
      lines.push(`📅 *До:* ${nightEnd}`)
    }

    const token = process.env.BOT_TOKEN
    if (token) {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: lines.join('\n'),
            parse_mode: 'Markdown',
          }),
        }
      )
      const tgJson = await tgRes.json()
      if (!tgJson.ok) console.error('[TG error]', tgJson)
    } else {
      console.error('BOT_TOKEN is not set')
    }

    // ── 2. Google Sheets ─────────────────────────────────────
    // Columns: Timestamp | form_name | form_yes | form_night | form_night_start | form_night_end
    const rowData = {
      form_name: name,
      form_yes: attending,
      form_night: accommodation,
      form_night_start: nightStart ?? '',
      form_night_end: nightEnd ?? '',
    }

    const sheetsRes = await fetch(
      `${SHEETS_URL}?data=${encodeURIComponent(JSON.stringify([rowData]))}`,
      { method: 'GET' }
    )
    const sheetsJson = await sheetsRes.json().catch(() => null)
    if (sheetsJson?.result !== 'success') {
      console.error('[Sheets error]', sheetsJson)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[RSVP error]', err)
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

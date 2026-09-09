import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    // Log the RSVP — replace with email/DB integration as needed
    console.log('[RSVP]', new Date().toISOString(), JSON.stringify(data))
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

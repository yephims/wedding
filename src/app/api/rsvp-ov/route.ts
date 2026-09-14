import { NextRequest, NextResponse } from 'next/server'

// URL для Google Apps Script для Олег & Віра
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyvEhMGxhrKHWYvZlSElHafo_TRPBOAziUB1NhCaxzBwmhO9TlzYsiSFTnah5BCHFzF/exec'

export async function POST(req: NextRequest) {
  console.log('=== RSVP-OV API викликано ===')
  
  try {
    const data = await req.json()
    const { name, attending, guestsCount } = data

    console.log('Отримані дані:', { name, attending, guestsCount })

    // ── Google Sheets запис ─────────────────────────────────────
    // Поля в таблиці: Timestamp, name, yes_no, count
    // Форматуємо дату у формат DD.MM.YYYY HH:mm
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    
    const timestamp = `${day}.${month}.${year} ${hours}:${minutes}`
    
    // Дані для Google Sheets (відповідає структуі таблиці)
    const rowData = {
      Timestamp: timestamp,
      name: name || '',
      yes_no: attending || '',
      count: guestsCount || '0'
    }

    console.log('Дані для Google Sheets:', rowData)

    // Відправляємо дані до Google Sheets
    const sheetsRes = await fetch(
      `${SHEETS_URL}?data=${encodeURIComponent(JSON.stringify([rowData]))}`,
      { 
        method: 'GET',
        mode: 'no-cors' // Дозволяє CORS для Google Apps Script
      }
    ).catch(err => {
      console.error('Помилка запиту до Google Sheets:', err)
      return null
    })

    if (sheetsRes) {
      try {
        const sheetsJson = await sheetsRes.json()
        console.log('Відповідь від Google Sheets:', sheetsJson)
        
        if (sheetsJson?.result !== 'success') {
          console.error('[Sheets error]', sheetsJson)
        }
      } catch (e) {
        // Може бути помилка парсингу при no-cors режимі
        console.log('Запит виконано, але не вдалося прочитати відповідь (no-cors mode)')
      }
    }

    // ── Локальне резервне копіювання (опціонально) ──────────────
    // Записуємо також локально на випадок проблем з Google Sheets
    try {
      const fs = await import('fs')
      const path = await import('path')
      
      const csvPath = path.join(process.cwd(), 'public', 'files', 'oleg-vira.csv')
      const publicDir = path.join(process.cwd(), 'public', 'files')
      
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }

      const headers = ['Timestamp', 'name', 'yes_no', 'count']
      
      const escapeCsv = (text: string) => {
        if (!text) return ''
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
          return `"${text.replace(/"/g, '""')}"`
        }
        return text
      }
      
      const row = [
        timestamp, 
        escapeCsv(name || ''),
        escapeCsv(attending || ''),
        escapeCsv(guestsCount || '0')
      ]
      
      let fileExists = fs.existsSync(csvPath)
      let fileContent = ''
      
      if (fileExists) {
        fileContent = fs.readFileSync(csvPath, 'utf8')
      }
      
      if (!fileExists || fileContent.trim() === '') {
        fs.writeFileSync(csvPath, headers.join(',') + '\n')
      }
      
      fs.appendFileSync(csvPath, row.join(',') + '\n')
      
      console.log('Резервна копія збережена локально')
    } catch (localErr) {
      console.warn('Не вдалося зберегти локальну копію:', localErr)
    }

    console.log(`=== Дані успішно відправлено до Google Sheets: ${name}, ${attending}, гостей: ${guestsCount || '0'} ===`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[RSVP-OV Помилка]', err)
    console.error('Стек помилки:', err instanceof Error ? err.stack : 'Немає стеку')
    return NextResponse.json({ ok: false, error: 'Помилка при збереженні' }, { status: 400 })
  }
}
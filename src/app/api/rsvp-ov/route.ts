import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  console.log('=== RSVP-OV API викликано ===')
  
  try {
    const data = await req.json()
    console.log('Отримані дані:', data)
    
    const { name, attending, guestsCount } = data

    // Шлях до CSV файлу
    const csvPath = path.join(process.cwd(), 'public', 'files', 'oleg-vira.csv')
    console.log('Шлях до CSV:', csvPath)
    
    const publicDir = path.join(process.cwd(), 'public', 'files')
    console.log('Директорія файлів:', publicDir)

    // Перевіряємо директорію
    if (!fs.existsSync(publicDir)) {
      console.log('Створюємо директорію:', publicDir)
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // Заголовок CSV
    const headers = ['timestamp', 'name', 'attending', 'guestsCount']
    
    // Форматуємо дату у формат DD.MM.YYYY HH:mm
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    
    const timestamp = `${day}.${month}.${year} ${hours}:${minutes}`
    console.log('Форматована дата:', timestamp)
    
    // Екранування для CSV
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
    
    console.log('Записуємо рядок:', row)
    
    // Перевіряємо, чи файл існує і чи має заголовки
    let fileExists = fs.existsSync(csvPath)
    let fileContent = ''
    
    if (fileExists) {
      fileContent = fs.readFileSync(csvPath, 'utf8')
      console.log('Поточний вміст файлу:', fileContent)
    }
    
    if (!fileExists || fileContent.trim() === '') {
      console.log('Створюємо новий файл з заголовками')
      fs.writeFileSync(csvPath, headers.join(',') + '\n')
    }
    
    // Додаємо новий рядок
    fs.appendFileSync(csvPath, row.join(',') + '\n')
    
    // Перевіряємо результат
    const newContent = fs.readFileSync(csvPath, 'utf8')
    console.log('Новий вміст файлу:', newContent)
    console.log('Розмір файлу:', fs.statSync(csvPath).size, 'байт')

    console.log(`=== Дані успішно збережено: ${name}, ${attending}, гостей: ${guestsCount || '0'} ===`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[RSVP-OV Помилка]', err)
    console.error('Стек помилки:', err instanceof Error ? err.stack : 'Немає стеку')
    return NextResponse.json({ ok: false, error: 'Помилка при збереженні' }, { status: 400 })
  }
}
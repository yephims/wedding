'use client'

import Image from 'next/image'
import { relative } from 'path'
import { useState, useRef, useEffect } from 'react'

// Жовтень 2026: 10 жовтня = субота (індекс 5 в сітці Пн-Нд)
const OCT_DAYS = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
]
const WEDDING_DAY = 10

// Wedding target date for countdown - 10 жовтня 2026
const WEDDING_DATE = new Date('2026-10-10T14:00:00').getTime()

type FormData = {
  name: string
  attending: string
  guestsCount: string
}

function useCountdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE - Date.now()
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function OlegViraPage() {
  const [opened, setOpened] = useState(false)
  const [form, setForm] = useState<FormData>({ name: '', attending: '', guestsCount: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [downloadClicks, setDownloadClicks] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timer = useCountdown()

  const set = (f: keyof FormData, v: string) => setForm(p => ({ ...p, [f]: v }))

  function openInvitation() {
    setOpened(true)
    audioRef.current?.play().catch(() => {})
    setTimeout(() => {
      document.getElementById('ag-invite')
    }, 900)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/rsvp-ov', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <>
    <div style={{ position:"relative", background: '#faf3eb', minHeight: '100vh', fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* ── HERO ── */}
      <section className="ag-hero">
        <h1 className="ag-heading">Wedding Invitation</h1>
        <p className="ag-subtext">тисніть сюди</p>
        <p className="ag-arrow">↓</p>

        <div className="ag-envelope" onClick={openInvitation} role="button" aria-label="Відкрити запрошення">
          <Image
            src="/oleg-vira/envelope.png"
            alt="Конверт"
            width={340}
            height={240}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Full photo after click */}
        <div className={`ag-full-photo${opened ? ' show' : ''}`} aria-hidden={!opened}>
          <Image src="/oleg-vira/foto-2.jpg" alt="Олег & Віра" fill style={{ objectFit: 'cover', filter: 'grayscale(40%)' }} />
          <div className="ag-photo-gradient" />
          <div className="ag-photo-caption">Олег &amp; Віра</div>
          <div className="ag-timer-wrap">
            <div className="ag-timer-title">До нашого весілля залишилось:</div>
            <div className="ag-timer">
              {([['d','днів'], ['h','год'], ['m','хв'], ['s','сек']] as const).map(([k, lbl]) => (
                <div key={k} className="ag-time-box">
                  <span className="ag-time-value">{pad(timer[k as keyof typeof timer])}</span>
                  <div className="ag-time-label">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <audio ref={audioRef} loop src="/artem-galynka/music.mp3" />
      </section>

      {/* ── INVITE + CALENDAR ── */}
      <div id="ag-invite" className="ag-invite-calendar-wrap">
        <div className="ag-invite">
          <p className="ag-dear">Дорогі Гості!</p>
          <p className="ag-invite-text">
Господь поєднує наші долі, тож
запрошуємо Вас
благословити нас на нове
життя та розділити радість
цього особливого дня
разом з нами!          </p>
        </div>

        <div className="ag-calendar-section">
          <div className="ag-calendar-inner">
            <div className="ag-calendar-photo" />
            <h2 className="ag-month">Жовтень</h2>
            <div className="ag-cal-grid">
              {['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d => (
                <div key={d} className="ag-cal-day ag-cal-hdr">{d}</div>
              ))}
              {OCT_DAYS.map((week, wi) =>
                week.map((day, di) => (
                  <div key={`${wi}-${di}`} className={day === WEDDING_DAY ? 'ag-heart-day' : 'ag-cal-day'}>
                    {day === WEDDING_DAY ? (
                      <>
                        <span className="ag-day-num">{day}</span>
                        <Image
                          src="/artem-galynka/heart.png"
                          alt="heart"
                          width={56}
                          height={56}
                          className="ag-heart-img"
                        />
                      </>
                    ) : (day ?? '')}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="ag-year">2026</div>
        </div>
      </div>

      {/* ── VENUE ── */}
      <div className="ag-venue">
        <h2 className="ag-venue-title">Локація</h2>

        <p className="ag-venue-addr"> Адреса: <br></br>Кременчук<br></br>вул. Ціолковського, 16</p>
        <a
          href="https://maps.app.goo.gl/E4gKGoukGW3yXAg96?g_st=atm"
          className="ag-map-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Подивитись на мапі
        </a>
      </div>

      {/* ── PROGRAM ── */}
      <section className="ag-program">
        <h2 className="ov-timing-title">Розклад дня</h2>
        <div className="ov-timeline">
          <div className="ov-event">
            <div className="ov-time">11:00</div>
            <div className="ov-title">Вінчання</div>
            <p className="ov-description">Приєднайтесь до нашої спільної молитви про благословення нашої сім'ї</p>
          </div>
          
          <div className="ov-event">
            <div className="ov-time">14:00</div>
            <div className="ov-title">Перерва</div>
            <p className="ov-description">Ви можете скористатися чудовою нагодою познайомитися з іншими гостями та відпочити</p>
          </div>
          
          <div className="ov-event">
            <div className="ov-time">14:30</div>
            <div className="ov-title">Весільний бенкет</div>
            <p className="ov-description">Найшильнішою пам'яттю для нас буде ваша щира участь, співи і теплі побажання. Хочемо, щоб атмосфера свята була неймовірною та врочистою</p>
          </div>
          
          <div className="ov-event">
            <div className="ov-time">19:00</div>
            <div className="ov-title">Завершення свята</div>
            <p className="ov-description">Час для привітання, спільних фото та теплих обіймів</p>
          </div>
        </div>
      </section>

      {/* ── DRESS CODE ── */}
      <div className="ag-dresscode">
        <div className="ag-dresscode-inner">
          <h2 className="ag-section-title">Дрес-код</h2>
          <p className="ag-section-text">
            Ми будемо дуже вдячні, якщо ви оберете наряди у кольорах нашого весілля:
          </p>
          <div className="ag-palette">
            <div className="ag-color-circle" style={{ background: '#F2B8B8' }} />
            <div className="ag-color-circle" style={{ background: '#F8C3AA' }} />
            <div className="ag-color-circle" style={{ background: '#F8DAD0' }} />
            <div className="ag-color-circle" style={{ background: '#F4E2C7' }} />
            <div className="ag-color-circle" style={{ background: '#D6B8A0' }} />
          </div>
        </div>
      </div>

 {/* ── PHOTOS ── */}
      <div className="ov-photos">
        <h2 className="ov-photos-title">Наші моменти</h2>
        <div className="ov-photos-grid">
          <div className="ov-photo ov-photo-top">
            <Image
              src="/oleg-vira/foto-5.jpg"
              alt="Олег та Віра"
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className="ov-photo">
            <Image
              src="/oleg-vira/foto-4.jpg"
              alt="Олег та Віра"
              width={300}
              height={400}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className="ov-photo">
            <Image
              src="/oleg-vira/foto-3.jpg"
              alt="Олег та Віра"
              width={300}
              height={400}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      
      {/* ── FORM ── */}
      <div className="ag-form-section">
        <h2 className="ag-form-title">Анкета гостя</h2>
        <p className="ag-form-subtitle">
          Будь ласка, надайте вашу відповідь про присутність до 27.09.2026
        </p>
        <div className="ag-form-wrap">
          {submitted ? (
            <div className="ag-success-wrap">
              <p className="ag-success">Дякуємо!<br></br><br></br>До зустрічі!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ag-field">
                <input
                  id="ag-name"
                  className="ag-input"
                  type="text"
                  required
                  placeholder="Ваше імʼя та прізвище"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>

              <div className="ag-field">
                <span className="ag-label">Чи плануєте ви бути на весіллі?</span>
                <div className="ag-radio-group">
                  {['Так', 'Ні'].map(opt => (
                    <label key={opt} className="ag-radio-item">
                      <input type="radio" name="attending" value={opt} required
                        checked={form.attending === opt} onChange={() => set('attending', opt)} />
                      <span className="ag-radio-icon" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="ag-field">
                <input
                  id="ag-guests"
                  className="ag-input"
                  type="number"
                  min="0"
                  placeholder="Кількість людей разом з вами"
                  value={form.guestsCount}
                  onChange={e => set('guestsCount', e.target.value)}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="ag-submit" disabled={loading}>
                  {loading ? 'Надсилається…' : 'Відправити →'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{ marginTop: 60 }}>
          <p className="ag-love"><span className="ag-heart-icon">❤</span><br /><br />З любовʼю</p>
          <p className="ag-names">Олег<br />&amp;<br />Віра</p>
        </div>
      </div>

      {/* Download button - appears only after 5 clicks */}
      <div 
        className="ov-download-btn"
        onClick={() => {
          const newClicks = downloadClicks + 1
          setDownloadClicks(newClicks)
          console.log(`Кліків на скачування: ${newClicks}/5`)
          
          if (newClicks >= 5) {
            // Створюємо тимчасовий лінк для скачування файлу
            const link = document.createElement('a')
            link.href = '/files/oleg-vira.csv'
            link.download = 'oleg-vira-guest-list.csv'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            // Скидаємо лічильник після скачування
            setDownloadClicks(0)
          }
        }}
      >
        {downloadClicks >= 5 ? 'Скачати список гостей' : `Натисніть ${5 - downloadClicks} разів для скачування списку гостей`}
      </div>

    </div>
    </>
  )
}

'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

// Жовтень 2026: 15 жовтня = четвер (індекс 3 в сітці Пн-Нд)
const OCT_DAYS = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
]
const WEDDING_DAY = 15

// Wedding target date for countdown
const WEDDING_DATE = new Date('2026-10-15T14:00:00').getTime()

type FormData = {
  name: string
  attending: string
  notes: string
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

export default function ArtemGalynaPage() {
  const [opened, setOpened] = useState(false)
  const [form, setForm] = useState<FormData>({ name: '', attending: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timer = useCountdown()

  const set = (f: keyof FormData, v: string) => setForm(p => ({ ...p, [f]: v }))

  function openInvitation() {
    setOpened(true)
    audioRef.current?.play().catch(() => {})
    setTimeout(() => {
      document.getElementById('ag-invite')?.scrollIntoView({ behavior: 'smooth' })
    }, 900)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/rsvp-ag', {
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
    <div style={{ background: '#faf3eb', minHeight: '100vh', fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* ── HERO ── */}
      <section className="ag-hero">
        <h1 className="ag-heading">Wedding Invitation</h1>
        <p className="ag-subtext">тисніть сюди</p>
        <p className="ag-arrow">↓</p>

        <div className="ag-envelope" onClick={openInvitation} role="button" aria-label="Відкрити запрошення">
          <Image
            src="/artem-galynka/envelope.png"
            alt="Конверт"
            width={340}
            height={240}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Full photo after click */}
        <div className={`ag-full-photo${opened ? ' show' : ''}`} aria-hidden={!opened}>
          <Image src="/artem-galynka/photo-couple.jpg" alt="Artem & Galinka" fill style={{ objectFit: 'cover', filter: 'grayscale(40%)' }} />
          <div className="ag-photo-gradient" />
          <div className="ag-photo-caption">Artem &amp; Galinka</div>
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

      {/* ── INVITE TEXT ── */}
      <div id="ag-invite" />
      <div className="ag-invite">
        <p className="ag-dear">Дорогі Гості!</p>
        <p className="ag-invite-text">
          Запрошуємо вас розділити з нами радість особливої для нас події та стати частиною нашої історії
        </p>
      </div>

      {/* ── CALENDAR ── */}
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
                        src="/artem-galynka/icon-wedding.png"
                        alt="♥"
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

      {/* ── VENUE ── */}
      <div className="ag-venue">
        <h2 className="ag-venue-title">Локація</h2>
        <Image
          src="/artem-galynka/liteplo.png"
          alt="Літепло"
          width={320}
          height={160}
          className="ag-venue-img"
          style={{ borderRadius: 60 }}
        />
        <p className="ag-venue-name"><strong>«ЛІТЕПЛО»</strong></p>
        <p className="ag-venue-addr">Kobzarivka, Ternopil Oblast</p>
        <a
          href="https://maps.app.goo.gl/yudcTGe4TQGTor6z7"
          className="ag-map-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Подивитись на мапі
        </a>
        <h2 className="ag-timing-title">Таймінг</h2>
      </div>

      {/* ── PROGRAM ── */}
      <section className="ag-program">
        <div className="ag-timeline">
          {[
            { label: 'Вінчання',          time: '14:00', img: '/artem-galynka/icon-wedding.png' },
            { label: 'Банкет',            time: '15:00', img: '/artem-galynka/icon-dinner.png' },
            { label: 'Перерва',           time: '17:30', img: '/artem-galynka/icon-break.png' },
            { label: 'Завершення вечора', time: '20:00', img: '/artem-galynka/icon-party.png' },
          ].map((item, i) => (
            <div key={i} className="ag-trow">
              <div className="ag-tleft">{item.label}</div>
              <div className="ag-tcenter">
                <div className="ag-line top" />
                <Image src={item.img} alt={item.label} width={60} height={60} style={{ filter: 'grayscale(100%) brightness(200%)' }} />
                <div className="ag-line bot" />
              </div>
              <div className="ag-tright">{item.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DRESS CODE ── */}
      <div className="ag-dresscode">
        <h2 className="ag-section-title">Дрес-код</h2>
        <p className="ag-section-text">
          Ми будемо дуже вдячні, якщо ви оберете наряди у кольорах нашого весілля:
        </p>
        <div className="ag-palette">
          <div className="ag-color-circle" style={{ background: '#572733' }} />
          <div className="ag-color-circle" style={{ background: '#656a52' }} />
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="ag-form-section">
        <h2 className="ag-form-title">Анкета гостя</h2>
        <p className="ag-form-subtitle">
          Будь ласка, надайте вашу відповідь про присутність до 20.09.2026
        </p>
        <div className="ag-form-wrap">
          {submitted ? (
            <p className="ag-success">Дякуємо! Чекаємо на вас 🤍</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ag-field">
                <label className="ag-label" htmlFor="ag-name">Ваше імʼя та прізвище</label>
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
                <label className="ag-label" htmlFor="ag-notes">
                  Тут ви можете написати будь-яку додаткову інформацію або побажання
                </label>
                <textarea
                  id="ag-notes"
                  className="ag-input ag-textarea"
                  placeholder="Тут ви можете написати будь-яку додаткову інформацію або побажання"
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
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
          <p className="ag-love">З любовʼю</p>
          <p className="ag-names">Artem<br />&amp;<br />Galinka</p>
        </div>
      </div>

    </div>
  )
}
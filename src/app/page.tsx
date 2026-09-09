'use client'

import Image from 'next/image'
import { useState } from 'react'

// ─── Листопад 2026 calendar data ───
// Nov 1 = Sunday (day index 6 in Mon-Sun grid)
const NOV_DAYS = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, null, null, null, null, null, null],
]
const HIGHLIGHTED_DAY = 15

type FormData = {
  name: string
  attending: string
  accommodation: string
  accommodationNight: string
}

export default function Home() {
  const [form, setForm] = useState<FormData>({
    name: '',
    attending: '',
    accommodation: '',
    accommodationNight: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main>
      {/* ══════════════ HERO ══════════════ */}
      <section className="hero">
        <p className="hero-small">15 листопада 2026</p>
        <h1 className="hero-names">Рулік &amp; Зоря</h1>
        <p className="hero-tagline">Одружуємось!</p>
        <p className="hero-poem">
          Маленькі ми…<br />
          Дві історії<br />
          Одне «так»
        </p>
        <div className="hero-photos">
          <div className="hero-photo-wrap">
            <Image src="/images/rul.jpg" alt="Рулік у дитинстві" width={200} height={260} className="hero-photo" />
          </div>
          <div className="hero-photo-wrap">
            <Image src="/images/zor.jpg" alt="Зоря у дитинстві" width={200} height={260} className="hero-photo" />
          </div>
        </div>
      </section>

      {/* ══════════════ INVITE ══════════════ */}
      <section className="invite-section">
        <p className="invite-dear">Любі Гості!</p>
        <p className="invite-text">
          Ми раді запросити вас на наше весілля — у день, сповнений любові, світла й справжніх емоцій.
          <br /><br />
          Приєднуйтесь, щоб відсвяткувати цей особливий день разом з нами.
        </p>
      </section>

      {/* ══════════════ CALENDAR ══════════════ */}
      <section className="calendar-section">
        <p className="calendar-month-label">Листопад 2026</p>
        <div className="calendar">
          <div className="weekdays">
            {['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d => (
              <div key={d} className="weekday">{d}</div>
            ))}
          </div>
          {NOV_DAYS.map((week, wi) => (
            <div key={wi} className="week">
              {week.map((day, di) => (
                <div key={di} className="day">
                  {day === HIGHLIGHTED_DAY ? (
                    <div className="ring">
                      <div className="diamond" aria-hidden>
                        <svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1 L19 6 L15 15 L9 15 L5 6 Z" />
                          <path d="M12 1 L15 6 L9 6 Z" />
                          <path d="M5 6 L19 6" />
                          <path d="M9 6 L9 15" />
                          <path d="M15 6 L15 15" />
                        </svg>
                      </div>
                      {day}
                    </div>
                  ) : day ?? ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="section-light" style={{ padding: '8px 0' }}>
        <Image src="/images/divider.png" alt="" width={320} height={57} className="divider-img" />
      </div>

      {/* ══════════════ VENUE ══════════════ */}
      <section className="venue-section">
        <h2 className="section-title" style={{ color: '#3d4a2a' }}>Місце проведення</h2>
        <p className="venue-name">Церква «Нове Життя»</p>
        <p className="venue-address">Транспортна, 7, Тернопіль</p>
        <Image
          src="/images/church-map.png"
          alt="Церква Нове Життя"
          width={340}
          height={240}
          className="venue-img"
          style={{ objectFit: 'contain' }}
        />
        <br />
        <a
          href="https://maps.app.goo.gl/aeRPJvfnjRE8bLpz8"
          className="map-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Подивитись на мапі
        </a>
        <div style={{ marginTop: 32 }}>
          <Image src="/images/divider.png" alt="" width={320} height={57} className="divider-img" />
        </div>
      </section>

      {/* ══════════════ DRESS CODE ══════════════ */}
      <section className="dresscode-section">
        <h2 className="section-title" style={{ color: '#3d4a2a' }}>Дрес-код</h2>
        <p className="section-subtitle" style={{ color: '#555' }}>
          Нам головне ваша присутність, але ми будемо вдячні, якщо ви підтримаєте кольорову гаму нашого свята
        </p>
        <div className="palette-wrapper">
          <div className="palette-row">
            {['#c7d3bb','#b4c189','#78866f','#6e8396','#a5c3dd'].map(c => (
              <div key={c} className="color-circle" style={{ background: c }} />
            ))}
          </div>
          <div className="palette-row">
            {['#ecd7bc','#ccbda0'].map(c => (
              <div key={c} className="color-circle" style={{ background: c }} />
            ))}
          </div>
        </div>
        <Image src="/images/divider.png" alt="" width={320} height={57} className="divider-img" />
      </section>

      {/* ══════════════ PROGRAM ══════════════ */}
      <section className="program-section">
        <h2 className="section-title">Програма дня</h2>
        <div className="timeline">
          {[
            { label: 'Зустріч гостей', time: '14:00', img: '/images/timeline-1.png' },
            { label: 'Церемонія',       time: '15:00', img: '/images/timeline-2.png' },
            { label: 'Банкет',          time: '16:00', img: '/images/timeline-3.png' },
          ].map((item, i) => (
            <div key={i} className="timeline-row" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="t-left">{item.label}</div>
              <div className="t-center">
                <div className="line-vert top" />
                <Image src={item.img} alt={item.label} width={56} height={56} style={{ filter: 'brightness(0) invert(1)' }} />
                <div className="line-vert bot" />
              </div>
              <div className="t-right">{item.time}</div>
            </div>
          ))}
        </div>
        <Image src="/images/divider.png" alt="" width={320} height={57} className="divider-img" />
      </section>

      {/* ══════════════ WISHES ══════════════ */}
      <section className="wishes-section">
        <h2 className="section-title" style={{ color: '#3d4a2a' }}>Побажання</h2>
        <p className="section-subtitle" style={{ color: '#555' }}>
          Просимо вас не дарувати нам квіти, нажаль, ми не встигнемо насолодитися їх красою.
        </p>
        <div className="wishes-icon">💍</div>
        <p className="section-subtitle" style={{ color: '#555' }}>
          Приємним компліментом для нас буде, якщо замість квітів ви вирішите обрати щось із нашого списку побажань.
          Кожен подарунок стане для нас частинкою турботи та нагадуванням про цей особливий день.
        </p>
      </section>

      {/* ══════════════ FORM ══════════════ */}
      <section className="form-section">
        <h2 className="section-title" style={{ color: '#3d4a2a' }}>Підтвердження присутності</h2>
        <div className="form-wrap">
          {submitted ? (
            <p className="form-success">
              Дякуємо! Ми вже чекаємо на вас 🌿
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-field">
                <label className="form-label" htmlFor="rsvp-name">Ваше імʼя та прізвище</label>
                <input
                  id="rsvp-name"
                  className="form-input"
                  type="text"
                  required
                  placeholder="Ваше імʼя та прізвище"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>

              {/* Attending */}
              <div className="form-field">
                <span className="form-label">Чи плануєте ви бути на весіллі?</span>
                <div className="radio-group" style={{ marginTop: 8 }}>
                  {['Так, із задоволенням!', 'На жаль, не зможу'].map(opt => (
                    <label key={opt} className="radio-item">
                      <input
                        type="radio"
                        name="attending"
                        value={opt}
                        required
                        checked={form.attending === opt}
                        onChange={() => set('attending', opt)}
                      />
                      <span className="radio-icon" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div className="form-field">
                <span className="form-label">Чи потрібна вам допомога з пошуком ночівлі?</span>
                <div className="radio-group" style={{ marginTop: 8 }}>
                  {['Так, буду вдячний/вдячна', 'Ні, дякую'].map(opt => (
                    <label key={opt} className="radio-item">
                      <input
                        type="radio"
                        name="accommodation"
                        value={opt}
                        required
                        checked={form.accommodation === opt}
                        onChange={() => {
                          set('accommodation', opt)
                          if (!opt.startsWith('Так')) set('accommodationNight', '')
                        }}
                      />
                      <span className="radio-icon" />
                      {opt}
                    </label>
                  ))}
                </div>

                {/* Conditional: which night */}
                {form.accommodation.startsWith('Так') && (
                  <div className="accommodation-extra">
                    <span className="form-label">Яка ніч вам потрібна?</span>
                    <div className="nights-grid">
                      {[
                        'З суботи на неділю (15 → 16 листопада)',
                        'З неділі на понеділок (16 → 17 листопада)',
                        'Обидві ночі',
                      ].map(opt => (
                        <label key={opt} className="radio-item">
                          <input
                            type="radio"
                            name="accommodationNight"
                            value={opt}
                            required={form.accommodation.startsWith('Так')}
                            checked={form.accommodationNight === opt}
                            onChange={() => set('accommodationNight', opt)}
                          />
                          <span className="radio-icon" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Надсилається…' : 'Відправити'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════ FINALE ══════════════ */}
      <section className="finale-section">
        <div className="finale-bg" aria-hidden />
        <div className="finale-overlay" aria-hidden />
        <div className="finale-content">
          <p className="finale-title">Чекаємо на вас!</p>
          <p className="finale-names">Рулік та Зоря</p>
        </div>
      </section>
    </main>
  )
}

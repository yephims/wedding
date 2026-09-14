import type { Metadata } from 'next'
import './oleg-vira.css'

export const metadata: Metadata = {
  title: 'Олег & Віра — Весілля 10 жовтня 2026',
  description: 'Запрошення на весілля Олега та Віри',
}

export default function OlegViraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

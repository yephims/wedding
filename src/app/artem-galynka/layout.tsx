import type { Metadata } from 'next'
import './ag.css'

export const metadata: Metadata = {
  title: 'Artem & Galinka — Весілля 15 жовтня 2026',
  description: 'Запрошення на весілля Артема та Галинки',
}

export default function AgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

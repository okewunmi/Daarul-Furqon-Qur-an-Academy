import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${minutes} ${ampm} WAT`
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  return `${formatDate(dateStr)} at ${formatTime(timeStr)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getWhatsAppLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export const ADMIN_WHATSAPP = '+2347076107558'

export function getPaymentWhatsAppMessage(name: string, program: string, plan: string): string {
  return `Assalamu Alaykum! I'm ${name}. I've registered for the ${program} program (${plan} payment plan) at Daarul Furqon Qur'an Academy. Please find my proof of payment attached. JazakAllahu Khayran.`
}

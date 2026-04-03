import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Daarul Furqon Qur'an Academy | Online Islamic Institute",
  description: "Learn the Qur'an online from anywhere. Structured programs for all levels — Foundation, Fluency, Hifz, Islamic Studies & Advanced Reflection. Live classes, flexible timing, certified teachers.",
  keywords: "Quran online, Islamic studies, Hifz, Tajweed, online academy, Nigeria, diaspora",
  openGraph: {
    title: "Daarul Furqon Qur'an Academy",
    description: "From Tilāwah to Hidayah — a complete journey through the Qur'an.",
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

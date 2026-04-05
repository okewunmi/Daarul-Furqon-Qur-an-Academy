import Link from 'next/link'
import { BookOpen, MessageCircle, Lock } from 'lucide-react'

const ADMIN_WHATSAPP = '+2347076107558'

export default function SuspendedPage() {
  const waMessage = encodeURIComponent(
    "Assalamu Alaykum! My student account at Daarul Furqon Qur'an Academy has been suspended. I would like to resolve this and regain access. JazakAllahu Khayran."
  )

  return (
    <div className="min-h-screen geometric-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-emerald-900" />
            </div>
            <div className="text-left">
              <div className="text-white font-display font-bold text-lg leading-tight">Daarul Furqon</div>
              <div className="text-gold-400 text-sm">Qur'an Academy</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
            Account Suspended
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Your student account has been temporarily suspended.
            You are currently unable to access your dashboard or classes.
          </p>

          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            This may be due to an outstanding payment or another issue.
            Please contact the admin to resolve this as soon as possible.
          </p>

          {/* Arabic reminder */}
          <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
            <p className="font-arabic text-emerald-700 text-xl mb-1">
              وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ
            </p>
            <p className="text-emerald-600 text-xs">
              "Establish prayer and give zakah." — Al-Baqarah 2:43
            </p>
          </div>

          {/* Contact admin */}
          <a
            href={`https://wa.me/${ADMIN_WHATSAPP.replace(/\D/g, '')}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Admin on WhatsApp
          </a>

          <p className="text-gray-400 text-xs">
            Admin: {ADMIN_WHATSAPP}
          </p>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <Link
              href="/"
              className="text-sm text-emerald-600 hover:text-gold-600 transition-colors font-medium"
            >
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
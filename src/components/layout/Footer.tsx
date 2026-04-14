import Link from 'next/link'
import { BookOpen, Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-emerald-950 text-emerald-100">
      {/* Islamic divider */}
      <div className="border-t border-emerald-800/50">
        <div className="text-center py-6">
          <p className="font-arabic text-gold-400 text-2xl tracking-wider">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-emerald-400 text-xs mt-1">In the name of Allah, the Most Gracious, the Most Merciful</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-900" />
              </div>
              <div>
                <div className="text-white font-display font-bold">Dārul Furqōn</div>
                {/* <div className="text-white font-display font-bold">Daarul Furqon</div> */}
                <div className="text-gold-400 text-xs">Academy</div>
              </div>
            </div>
            <p className="text-emerald-300 text-sm leading-relaxed max-w-sm">
              From Tilāwah to Hidayah — a complete journey of nurturing through the
              Qur'an and the Deen. Open to learners worldwide.
            </p>
            <div className="mt-4 text-emerald-400 text-xs italic font-arabic">
              "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
            </div>
            <div className="text-emerald-500 text-xs mt-0.5">
              "And recite the Qur'an with measured recitation." (73:4)
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Programs</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Foundation (N.U.R)', href: '/#programs' },
                { label: 'Fluency (F.A.R.A.H)', href: '/#programs' },
                { label: 'Hifz (S.A.B.R)', href: '/#programs' },
                { label: 'Understanding (D.E.E.N)', href: '/#programs' },
                { label: 'Advanced (T.A.D.A.B.B.U.R)', href: '/#programs' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-emerald-300 hover:text-gold-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-emerald-300">
                <Phone className="w-4 h-4 mt-0.5 text-gold-400 shrink-0" />
                <a href="https://wa.me/2348148168900" className="hover:text-gold-400 transition-colors">
                  +2348148168900
                </a>
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-400 shrink-0" />
                <span>Online — Worldwide</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-emerald-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all"
              >
                Enroll Today
              </Link>
            </div>
          </div> */}
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-emerald-300">
                <Phone className="w-4 h-4 mt-0.5 text-gold-400 shrink-0" />
                <a href="https://wa.me/2348148168900" className="hover:text-gold-400 transition-colors">
                  +2348148168900
                </a>
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <Mail className="w-4 h-4 mt-0.5 text-gold-400 shrink-0" />
                <a href="mailto:darulfurqonacademy@gmail.com" className="hover:text-gold-400 transition-colors">
                  darulfurqonacademy@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-400 shrink-0" />
                <span>Online — Worldwide</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-emerald-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all"
              >
                Enroll Today
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-800/50 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-emerald-500">
          <p>© {currentYear} Dārul Furqōn Academy. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-gold-500 fill-gold-500" /> for the Ummah
          </p>
        </div>
      </div>
    </footer>
  )
}

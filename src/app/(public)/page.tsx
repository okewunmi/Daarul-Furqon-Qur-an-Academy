import HeroSection from '@/components/public/HeroSection'
import ProgramsSection from '@/components/public/ProgramsSection'
import PricingSection from '@/components/public/PricingSection'
import FAQSection from '@/components/public/FAQSection'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProgramsSection />
      <PricingSection />

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="badge-gold mb-4 inline-block">How to Enroll</span>
            <h2 className="section-title mb-4">Simple Steps to Get Started</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'Fill out the registration form with your details, chosen program, and preferred schedule.', icon: '📝' },
              { step: '02', title: 'Pay & Send Proof', desc: 'Make your payment and send proof to the admin via WhatsApp (+234 707 610 7558).', icon: '💳' },
              { step: '03', title: 'Receive Login', desc: 'Admin creates your account within 24 hours and sends you your login credentials.', icon: '🔑' },
              { step: '04', title: 'Start Learning', desc: 'Log in to your dashboard, find your class schedule and Google Meet link. Bismillah!', icon: '📖' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="relative">
                {/* Connector line */}
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-emerald-200 to-transparent -translate-y-0.5 z-0 last:hidden" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl geometric-bg flex items-center justify-center text-2xl shadow-lg">
                    {icon}
                  </div>
                  <div className="text-gold-500 text-xs font-bold mb-1">STEP {step}</div>
                  <h3 className="font-display font-bold text-emerald-900 text-lg mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
              Register Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Final CTA */}
      <section className="py-20 geometric-bg">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="font-arabic text-gold-400 text-3xl mb-4">وَعَلَّمَكَ مَا لَمْ تَكُن تَعْلَمُ</p>
          <p className="text-emerald-300 text-sm mb-8">"And He taught you what you did not know." (4:113)</p>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Begin Your Qur'anic Journey Today
          </h2>
          <p className="text-emerald-200 mb-8">Join hundreds of students learning from anywhere in the world.</p>
          <Link href="/register" className="btn-gold inline-flex items-center gap-2 text-lg px-10 py-4">
            Enroll Now — It's Barakah <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}

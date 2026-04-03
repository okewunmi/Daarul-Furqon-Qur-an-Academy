'use client'

import Link from 'next/link'
import { ArrowRight, Star, Users, BookOpen, Globe } from 'lucide-react'
import { useEffect, useRef } from 'react'

const stats = [
  { icon: BookOpen, value: '5', label: 'Programs' },
  { icon: Users, value: '100+', label: 'Students Enrolled' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
  { icon: Globe, value: '10+', label: 'Countries' },
]

export default function HeroSection() {
  const revealRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    revealRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  return (
    <section className="relative min-h-screen geometric-bg flex items-center overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-gold-400/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />

      {/* Large Arabic text background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-arabic text-[20vw] text-gold-400/5 leading-none">القرآن</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div
              ref={addRef}
              className="reveal inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gold-300 text-sm font-medium">Now Enrolling — 4-Month Cycle</span>
            </div>

            <h1
              ref={addRef}
              className="reveal font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              Learn the{' '}
              <span className="gold-shimmer">Qur'an</span>
              <br />
              From Anywhere
            </h1>

            <p
              ref={addRef}
              className="reveal text-emerald-200 text-lg leading-relaxed mb-8 max-w-lg"
              style={{ animationDelay: '0.2s' }}
            >
              Structured online programs for all levels — from beginner reading to memorization,
              Islamic studies, and deep Qur'anic reflection. Live classes, flexible timing,
              qualified teachers.
            </p>

            {/* Journey tagline */}
            <div
              ref={addRef}
              className="reveal mb-8 p-4 rounded-2xl bg-white/5 border border-white/10"
              style={{ animationDelay: '0.25s' }}
            >
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">The TARBIYAH Journey</p>
              <div className="flex flex-wrap gap-1 text-xs text-emerald-300">
                {['Tilāwah', '→', 'Advance', '→', 'Retain', '→', 'Baseerah', '→', 'Implement', '→', 'Yaqeen', '→', 'Actualize', '→', 'Hidayah'].map((item, i) => (
                  <span key={i} className={item === '→' ? 'text-gold-500' : 'text-emerald-200 font-medium'}>{item}</span>
                ))}
              </div>
            </div>

            <div
              ref={addRef}
              className="reveal flex flex-wrap gap-4"
              style={{ animationDelay: '0.3s' }}
            >
              <Link href="/register" className="btn-gold flex items-center gap-2 text-base">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#programs" className="btn-outline border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 hover:text-white text-base">
                View Programs
              </Link>
            </div>
          </div>

          {/* Right — stats card */}
          <div
            ref={addRef}
            className="reveal"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              {/* Arabic verse */}
              <div className="text-center mb-6 pb-6 border-b border-white/10">
                <p className="font-arabic text-gold-400 text-2xl leading-relaxed mb-2">
                  اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
                </p>
                <p className="text-emerald-400 text-sm">"Read in the name of your Lord who created." (96:1)</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                    <Icon className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                    <div className="font-display text-2xl font-bold text-white">{value}</div>
                    <div className="text-emerald-300 text-xs mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {['Live Classes', 'Certified Teachers', 'Flexible Timing', 'Local & Diaspora'].map(badge => (
                  <span key={badge} className="badge-gold text-xs">{badge}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 30C1200 0 960 60 720 30C480 0 240 60 0 30L0 60Z" fill="#fafafa" />
        </svg>
      </div>
    </section>
  )
}

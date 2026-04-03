'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { PROGRAMS } from '@/types'
import { useEffect, useRef } from 'react'

export default function ProgramsSection() {
  const revealRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    revealRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  return (
    <section id="programs" className="py-24 geometric-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={el => addRef(el as HTMLElement)} className="reveal text-center mb-16">
          <span className="badge-emerald mb-4 inline-block">Our Curriculum</span>
          <h2 className="section-title mb-4">
            Five Paths to <span className="text-gold-600">Qur'anic Mastery</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Each program is a structured 4-month cycle designed for measurable progress,
            guided by qualified instructors in live online classes.
          </p>
        </div>

        {/* Programs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((program, index) => (
            <div
              key={program.id}
              ref={el => addRef(el as HTMLElement)}
              className="reveal card card-hover group cursor-default"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              {/* Top gradient bar */}
              <div className={`h-1.5 rounded-full bg-gradient-to-r ${program.color} mb-6`} />

              {/* Icon + Level */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{program.icon}</span>
                <span className="badge-gold text-xs">{program.level}</span>
              </div>

              {/* Acronym */}
              <div className="mb-1">
                <span className="font-display text-2xl font-bold text-emerald-800">
                  {program.acronym}
                </span>
              </div>
              <div className="text-emerald-600 text-xs font-medium mb-1 italic">
                {program.fullAcronym}
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-900 mb-3">
                {program.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {program.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {program.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Outcome */}
              <div className="bg-emerald-50 rounded-xl p-3 mb-5">
                <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-1">Outcome</p>
                <p className="text-emerald-800 text-sm">{program.outcome}</p>
              </div>

              {/* CTA */}
              <Link
                href={`/register?program=${program.id}`}
                className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm group-hover:text-gold-600 transition-colors"
              >
                Enroll in this program
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}

          {/* Tarbiyah journey card */}
          <div
            ref={el => addRef(el as HTMLElement)}
            className="reveal geometric-bg rounded-2xl p-6 text-white md:col-span-2 lg:col-span-1"
            style={{ transitionDelay: '0.4s' }}
          >
            <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4">The Complete Journey</p>
            <h3 className="font-display text-2xl font-bold mb-6">TARBIYAH</h3>
            <div className="space-y-3">
              {[
                { letter: 'T', word: 'Tilāwah', sub: 'Read' },
                { letter: 'A', word: 'Advance', sub: 'Improve' },
                { letter: 'R', word: 'Retain', sub: 'Memorize' },
                { letter: 'B', word: 'Baseerah', sub: 'Understand' },
                { letter: 'I', word: 'Implement', sub: 'Practice' },
                { letter: 'Y', word: 'Yaqeen', sub: 'Internalize' },
                { letter: 'A', word: 'Actualize', sub: 'Live' },
                { letter: 'H', word: 'Hidayah', sub: 'Convey' },
              ].map(({ letter, word, sub }) => (
                <div key={word} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-display font-bold text-sm shrink-0">
                    {letter}
                  </span>
                  <div>
                    <span className="text-white font-semibold text-sm">{word}</span>
                    <span className="text-emerald-400 text-xs ml-2">— {sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { Check, Zap, Clock, Calendar } from 'lucide-react'
import { PAYMENT_PLANS } from '@/types'
import { useEffect, useRef } from 'react'

const planIcons = { full: Zap, installment: Calendar, monthly: Clock }
const planHighlight = { full: true, installment: false, monthly: false }

const features = [
  '4-month structured learning cycle',
  'Live online classes with qualified instructors',
  'One-on-one & group sessions',
  'Recorded support materials',
  'Progress tracking & assessments',
  'Completion certificate',
  'Open to local & international students',
  'Flexible timezone scheduling (WAT GMT+1)',
]

export default function PricingSection() {
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
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={el => addRef(el as HTMLElement)} className="reveal text-center mb-16">
          <span className="badge-gold mb-4 inline-block">Pricing Plans</span>
          <h2 className="section-title mb-4">
            Flexible Payments for <span className="text-gold-600">Every Learner</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Choose a payment plan that works for you. All plans include the same
            high-quality education and full program access.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PAYMENT_PLANS.map((plan, i) => {
            const Icon = planIcons[plan.id]
            const highlighted = planHighlight[plan.id]
            return (
              <div
                key={plan.id}
                ref={el => addRef(el as HTMLElement)}
                className={`reveal rounded-2xl p-8 relative overflow-hidden card-hover ${
                  highlighted
                    ? 'geometric-bg text-white shadow-2xl shadow-emerald-900/30 scale-105'
                    : 'border-2 border-gray-100 bg-white'
                }`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {highlighted && (
                  <div className="absolute top-4 right-4">
                    <span className="badge-gold text-xs">Best Value</span>
                  </div>
                )}

                <Icon className={`w-10 h-10 mb-4 ${highlighted ? 'text-gold-400' : 'text-emerald-600'}`} />

                <h3 className={`font-display text-xl font-bold mb-1 ${highlighted ? 'text-white' : 'text-emerald-900'}`}>
                  {plan.label}
                </h3>
                <p className={`text-sm mb-6 ${highlighted ? 'text-emerald-300' : 'text-gray-500'}`}>
                  {plan.description}
                </p>

                <div className={`font-display text-4xl font-bold mb-1 ${highlighted ? 'text-gold-400' : 'text-emerald-800'}`}>
                  {plan.amount}
                </div>
                <p className={`text-xs mb-8 ${highlighted ? 'text-emerald-400' : 'text-gray-400'}`}>
                  per 4-month cycle
                </p>

                <Link
                  href={`/register?plan=${plan.id}`}
                  className={`block text-center font-semibold py-3 rounded-xl transition-all ${
                    highlighted
                      ? 'bg-gold-400 text-emerald-900 hover:bg-gold-500'
                      : 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                  }`}
                >
                  Choose {plan.label}
                </Link>
              </div>
            )
          })}
        </div>

        {/* What's included */}
        <div
          ref={el => addRef(el as HTMLElement)}
          className="reveal bg-gradient-to-br from-emerald-50 to-gold-50 rounded-3xl p-8 md:p-12"
        >
          <h3 className="font-display text-2xl font-bold text-emerald-900 text-center mb-8">
            Everything Included in Every Plan
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(feature => (
              <div key={feature} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gold-50 border border-gold-200 rounded-2xl text-center">
            <p className="text-emerald-800 text-sm">
              <strong className="text-gold-700">Payment Process:</strong> After registering, send your proof of payment to our admin via WhatsApp.
              Your login details will be created within 24 hours.{' '}
              <a
                href="https://wa.me/2348148168900"
                className="text-emerald-700 font-semibold underline hover:text-gold-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Admin →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

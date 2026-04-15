// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { ChevronDown } from 'lucide-react'
// import { cn } from '@/lib/utils'

// const faqs = [
//   {
//     q: 'Who can enroll?',
//     a: 'Anyone — children, teenagers, and adults. We have programs suitable for all age groups, from complete beginners to advanced learners.',
//   },
//   {
//     q: 'Do I need prior knowledge to join?',
//     a: 'No. Beginners are fully accommodated in our Foundation Class (N.U.R). We start from the very basics — Arabic letters, sounds, and reading rules.',
//   },
//   {
//     q: 'How are classes scheduled?',
//     a: 'You choose whether you prefer weekdays or weekends, and your preferred time slot. All times are in WAT (GMT+1). We offer 4 classes per week, each 1 hour long.',
//   },
//   {
//     q: 'Are classes live or recorded?',
//     a: 'Classes are primarily live sessions via Google Meet with qualified instructors. Support materials and recordings may be provided where necessary.',
//   },
//   {
//     q: 'How do I join my class after registering?',
//     a: 'Once your payment is confirmed and your account is created, you will log in to your student dashboard where you will find your class schedule and a unique Google Meet link for each session.',
//   },
//   {
//     q: 'Can I switch levels?',
//     a: 'Yes. Students are assessed regularly and can be moved to a more suitable level. Just contact the admin.',
//   },
//   {
//     q: 'What happens after the 4-month cycle?',
//     a: "Students can progress to the next level, continue for mastery, join the Hifz track, or transition to advanced classes. Extensions are also available for those who need more time.",
//   },
//   {
//     q: 'How does payment work?',
//     a: 'After completing your registration form, you send your proof of payment to our admin WhatsApp number (+2347076107558). The admin then creates your login credentials within 24 hours.',
//   },
//   {
//     q: 'Is there certification?',
//     a: 'Yes. Students receive completion recognition based on their performance at the end of each cycle.',
//   },
//   {
//     q: 'Is this open to students outside Nigeria?',
//     a: 'Absolutely. Daarul Furqon is open to diaspora and international students worldwide. Class schedules are flexible to accommodate different time zones.',
//   },
  
// ]

// function FAQItem({ question, answer }: { question: string; answer: string }) {
//   const [open, setOpen] = useState(false)

//   return (
//     <div className={cn('border rounded-2xl overflow-hidden transition-all duration-200', open ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-white hover:border-emerald-100')}>
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex items-center justify-between gap-4 p-5 text-left"
//       >
//         <span className={cn('font-semibold text-sm md:text-base transition-colors', open ? 'text-emerald-800' : 'text-gray-800')}>
//           {question}
//         </span>
//         <ChevronDown className={cn('w-5 h-5 shrink-0 transition-transform duration-200 text-emerald-600', open && 'rotate-180')} />
//       </button>
//       <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-40' : 'max-h-0')}>
//         <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{answer}</p>
//       </div>
//     </div>
//   )
// }

// export default function FAQSection() {
//   const ref = useRef<HTMLDivElement>(null)
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
//       { threshold: 0.1 }
//     )
//     if (ref.current) observer.observe(ref.current)
//     return () => observer.disconnect()
//   }, [])

//   return (
//     <section id="faq" className="py-24 geometric-light">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6">
//         <div ref={ref} className="reveal text-center mb-12">
//           <span className="badge-emerald mb-4 inline-block">FAQs</span>
//           <h2 className="section-title mb-4">
//             Frequently Asked <span className="text-gold-600">Questions</span>
//           </h2>
//           <p className="section-subtitle mx-auto">
//             Everything you need to know before enrolling.
//           </p>
//         </div>

//         <div className="space-y-3">
//           {faqs.map(faq => (
//             <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
//           ))}
//         </div>

//         <div className="mt-10 text-center">
//           <p className="text-gray-600 mb-4">Still have questions?</p>
//           <a
//             href="https://wa.me/2348148168900?text=Assalamu%20Alaykum!%20I%20have%20a%20question%20about%20Daarul%20Furqon%20Qur'an%20Academy."
//             target="_blank"
//             rel="noopener noreferrer"
//             className="btn-primary inline-flex items-center gap-2"
//           >
//             Chat on WhatsApp
//           </a>
//         </div>
//       </div>
//     </section>
//   )
// }
'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Who can enroll?',
    a: 'Anyone — children, teenagers, and adults. We have programs suitable for all age groups, from complete beginners to advanced learners.',
  },
  {
    q: 'Do I need prior knowledge to join?',
    a: 'No. Beginners are fully accommodated in our Foundation Class (N.U.R). We start from the very basics — Arabic letters, sounds, and reading rules.',
  },
  {
    q: 'How are classes scheduled?',
    a: 'You choose whether you prefer weekdays or weekends, and your preferred time slot. All times are in WAT (GMT+1). We offer 3 classes per week, each 50 minutes long (150 minutes total per week).',
  },
  {
    q: 'What language are classes taught in?',
    a: 'All classes are delivered in English, making them accessible to students from Nigeria and the diaspora worldwide.',
  },
  {
    q: 'Are classes live or recorded?',
    a: 'Classes are primarily live sessions via Google Meet with qualified instructors. Support materials and recordings may be provided where necessary.',
  },
  {
    q: 'How do I join my class after registering?',
    a: 'Once your payment is confirmed and your account is created, you will log in to your student dashboard where you will find your class schedule and a unique Google Meet link for each session.',
  },
  {
    q: 'Can I switch levels?',
    a: 'Yes. Students are assessed regularly and can be moved to a more suitable level. Just contact the admin.',
  },
  {
    q: 'What happens after the 4-month cycle?',
    a: "Students can progress to the next level, continue for mastery, join the Hifz track, or transition to advanced classes. Extensions are also available for those who need more time.",
  },
  {
    q: 'How does payment work?',
    a: 'After completing your registration form, you send your proof of payment to our admin WhatsApp number (+2348148168900). The admin then creates your login credentials within 24 hours.',
  },
  {
    q: 'Is there certification?',
    a: 'Yes. Students receive completion recognition based on their performance at the end of each cycle.',
  },
  {
    q: 'Is this open to students outside Nigeria?',
    a: 'Absolutely. Daarul Furqon is open to diaspora and international students worldwide. Class schedules are flexible to accommodate different time zones.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('border rounded-2xl overflow-hidden transition-all duration-200', open ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-white hover:border-emerald-100')}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className={cn('font-semibold text-sm md:text-base transition-colors', open ? 'text-emerald-800' : 'text-gray-800')}>
          {question}
        </span>
        <ChevronDown className={cn('w-5 h-5 shrink-0 transition-transform duration-200 text-emerald-600', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-40' : 'max-h-0')}>
        <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="faq" className="py-24 geometric-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="reveal text-center mb-12">
          <span className="badge-emerald mb-4 inline-block">FAQs</span>
          <h2 className="section-title mb-4">
            Frequently Asked <span className="text-gold-600">Questions</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Everything you need to know before enrolling.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(faq => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>
  
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="https://wa.me/2348148168900?text=Assalamu%20Alaykum!%20I%20have%20a%20question%20about%20Dārul%20Furqōn%20Academy."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
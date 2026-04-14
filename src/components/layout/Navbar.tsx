'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/#programs', label: 'Programs' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-emerald-950/95 backdrop-blur-md shadow-lg shadow-emerald-950/20'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-emerald-900" />
            </div>
            <div>
              <div className="text-white font-display font-bold text-sm leading-tight">Dārul Furqōn</div>
              <div className="text-gold-300 text-xs leading-tight"> Academy</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-emerald-100 hover:text-gold-400 font-medium text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-emerald-100 hover:text-gold-400 font-medium text-sm transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-gold-400 to-gold-500 text-emerald-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-gold-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-emerald-950/98 backdrop-blur-md border-t border-emerald-800 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2.5 text-emerald-100 hover:text-gold-400 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-emerald-800 space-y-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block text-center py-2.5 text-emerald-100 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="block text-center btn-gold"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

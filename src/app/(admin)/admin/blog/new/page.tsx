'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'

export default function NewBlogPostPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'general',
    tags: '',
    status: 'draft' as 'draft' | 'published',
  })

  const update = (key: string, value: string) => {
    if (key === 'title') {
      setForm(prev => ({ ...prev, title: value, slug: slugify(value) }))
    } else {
      setForm(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const status = publish ? 'published' : form.status
      const { error: err } = await supabase.from('blog_posts').insert({
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        content: form.content,
        cover_image: form.cover_image || null,
        category: form.category,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        status,
        author_id: user?.id,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      if (err) throw err
      router.push('/admin/blog')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['general', 'tajweed', 'tafsir', 'fiqh', 'seerah', 'hifz', 'inspiration', 'announcements']

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-emerald-900">New Blog Post</h1>
          <p className="text-gray-500 text-sm">Write and publish an article for the website.</p>
        </div>
        <button
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-2 text-sm text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-50"
        >
          <Eye className="w-4 h-4" />
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            {!preview ? (
              <>
                <div>
                  <label className="label-field">Title *</label>
                  <input
                    className="input-field text-lg font-semibold"
                    placeholder="e.g. The Virtues of Reciting Surah Al-Mulk"
                    value={form.title}
                    onChange={e => update('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label-field">URL Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">/blog/</span>
                    <input
                      className="input-field flex-1"
                      value={form.slug}
                      onChange={e => update('slug', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field">Excerpt (short summary)</label>
                  <textarea
                    className="input-field resize-none min-h-16"
                    placeholder="A brief description shown in blog listings..."
                    value={form.excerpt}
                    onChange={e => update('excerpt', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label-field">Content *</label>
                  <textarea
                    className="input-field resize-none min-h-80 font-body text-sm leading-relaxed"
                    placeholder={`Write your article here...\n\nYou can use:\n## Heading\n**Bold text**\n*Italic text*\n\n> Blockquote for Quranic verses or hadith\n\nParagraphs separated by blank lines.`}
                    value={form.content}
                    onChange={e => update('content', e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="prose-islamic min-h-80">
                <h1 className="font-display text-3xl font-bold text-emerald-900 mb-3">{form.title || 'Untitled Post'}</h1>
                {form.excerpt && <p className="text-gray-500 italic mb-6">{form.excerpt}</p>}
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {form.content || 'No content yet...'}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={e => handleSubmit(e, false)}
              disabled={loading}
              className="btn-outline flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save as Draft
            </button>
            <button
              onClick={e => handleSubmit(e, true)}
              disabled={loading || !form.title || !form.content}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Publish Post
            </button>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-semibold text-gray-800">Post Settings</h3>

            <div>
              <label className="label-field">Category</label>
              <select className="input-field" value={form.category} onChange={e => update('category', e.target.value)}>
                {categories.map(c => (
                  <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Tags (comma-separated)</label>
              <input
                className="input-field"
                placeholder="quran, tajweed, hifz"
                value={form.tags}
                onChange={e => update('tags', e.target.value)}
              />
            </div>

            <div>
              <label className="label-field">Cover Image URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://..."
                value={form.cover_image}
                onChange={e => update('cover_image', e.target.value)}
              />
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-700">
            <p className="font-semibold mb-1">Writing Tips</p>
            <ul className="space-y-1 text-xs text-emerald-600">
              <li>• Use ## for headings</li>
              <li>• Use **text** for bold</li>
              <li>• Use {'>'}  for Quranic quotes</li>
              <li>• Keep paragraphs short</li>
              <li>• Add a category & tags for SEO</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

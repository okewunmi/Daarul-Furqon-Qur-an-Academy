import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(full_name)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-emerald-900 mt-8 mb-3">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="font-display text-xl font-bold text-emerald-800 mt-6 mb-2">{line.slice(4)}</h3>
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-gold-400 pl-4 my-4 font-arabic text-emerald-800 text-lg italic">{line.slice(2)}</blockquote>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-800 my-2">{line.slice(2, -2)}</p>
      if (line === '') return <br key={i} />
      return <p key={i} className="text-gray-700 leading-relaxed my-2">{line}</p>
    })
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Hero */}
      <div className="geometric-bg py-14 mb-10">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-emerald-300 hover:text-gold-400 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <span className="badge-gold mb-3 inline-block capitalize">{post.category}</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-emerald-300 text-sm flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.published_at ? formatDate(post.published_at) : ''}
            </span>
            {(post.author as any)?.full_name && (
              <span>By {(post.author as any).full_name}</span>
            )}
            {post.tags?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {post.tags.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Cover image */}
        {post.cover_image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
            <img src={post.cover_image} alt={post.title} className="w-full h-64 object-cover" />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-gray-600 italic border-l-4 border-gold-400 pl-4 mb-8">{post.excerpt}</p>
        )}

        {/* Content */}
        <article className="prose-islamic">
          {renderContent(post.content)}
        </article>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/blog" className="btn-outline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> All Articles
            </Link>
            <Link href="/register" className="btn-primary">
              Enroll in a Program →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

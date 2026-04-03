import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'

export const revalidate = 60

export default async function BlogPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const categories = ['all', ...Array.from(new Set((posts || []).map(p => p.category)))]

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Header */}
      <div className="geometric-bg py-16 mb-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="badge-gold mb-4 inline-block">Knowledge & Inspiration</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            The Academy <span className="gold-shimmer">Blog</span>
          </h1>
          <p className="text-emerald-300 text-lg max-w-xl mx-auto">
            Articles on Tajweed, Tafsir, Fiqh, Islamic reflection, and academy news.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-2">No articles yet.</p>
            <p className="text-gray-400 text-sm">Check back soon for Islamic content and academy updates.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover image / placeholder */}
                <div className="h-44 geometric-bg relative overflow-hidden">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="font-arabic text-gold-400/40 text-6xl">القرآن</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="badge-gold text-xs capitalize">{post.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-display font-bold text-emerald-900 text-lg leading-snug mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.published_at ? formatDate(post.published_at) : ''}</span>
                    <span className="text-emerald-600 font-medium group-hover:text-gold-600 transition-colors">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
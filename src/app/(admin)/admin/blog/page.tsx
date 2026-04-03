'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'

export default function AdminBlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => { load() }, [filter])

  const load = async () => {
    let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setPosts(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    load()
  }

  const handlePublish = async (id: string, status: string) => {
    await supabase.from('blog_posts').update({
      status: status === 'published' ? 'draft' : 'published',
      published_at: status === 'published' ? null : new Date().toISOString(),
    }).eq('id', id)
    load()
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Manage articles and Islamic content for the website.</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all', 'published', 'draft'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No posts yet.</p>
          <Link href="/admin/blog/new" className="btn-primary inline-flex items-center gap-2 mt-4">
            <Plus className="w-4 h-4" /> Write First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-gold-100 flex items-center justify-center shrink-0 text-2xl">
                📝
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-800">{post.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>{post.status}</span>
                </div>
                {post.excerpt && <p className="text-gray-500 text-sm line-clamp-1">{post.excerpt}</p>}
                <div className="text-gray-400 text-xs mt-1">
                  {post.category} · {formatDate(post.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {post.status === 'published' && (
                  <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={() => handlePublish(post.id, post.status)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                    post.status === 'published'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <Link href={`/admin/blog/${post.id}/edit`} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

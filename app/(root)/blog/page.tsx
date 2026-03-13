"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { sanityClient } from "@/lib/sanityClient"

type BlogPost = {
  _id: string
  title: string
  slug?: { current: string }
  excerpt?: string
  mainImage?: { asset?: { url?: string } }
  publishedAt?: string
}

const query = `*[_type == "post"] | order(publishedAt desc)[0...20]{
  _id,
  title,
  slug,
  excerpt,
  mainImage{
    asset->{url}
  },
  publishedAt
}`

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sanityClient.fetch<BlogPost[]>(query)
        setPosts(data || [])
      } catch (err: any) {
        setError("Unable to load blog posts yet. Set up Sanity credentials and schemas.")
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-secondary px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-libre font-bold text-primary">Blog</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Stories, lessons, and updates from the Female Foundation community, powered by Sanity.
          </p>
        </header>

        {loading && <p className="text-sm text-gray-500">Loading posts…</p>}
        {error && !loading && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          {posts.map((post) => {
            const href = post.slug?.current ? `/blog/${post.slug.current}` : "#"
            const imageUrl = post.mainImage?.asset?.url

            return (
              <Link
                key={post._id}
                href={href}
                className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {imageUrl && (
                    <div className="hidden sm:block w-32 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-xs text-gray-500">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "Draft"}
                    </p>
                    <h2 className="text-lg font-semibold text-primary mt-1">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{post.excerpt}</p>
                    )}
                    <p className="mt-2 text-xs text-accent font-medium">Read more</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {!loading && posts.length === 0 && !error && (
          <p className="mt-8 text-sm text-gray-500">
            No posts yet. Once you publish posts in Sanity (type: post), they will appear here.
          </p>
        )}
      </div>
    </main>
  )
}



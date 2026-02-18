"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { sanityClient } from "@/lib/sanityClient"

type BlogPostDetail = {
  _id: string
  title: string
  body?: any
  publishedAt?: string
}

const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  body,
  publishedAt
}`

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.slug) return

    const load = async () => {
      try {
        const data = await sanityClient.fetch<BlogPostDetail | null>(query, {
          slug: params.slug,
        })
        if (!data) {
          setError("Post not found.")
        } else {
          setPost(data)
        }
      } catch (err: any) {
        setError("Unable to load this post.")
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params?.slug])

  return (
    <main className="min-h-screen bg-secondary px-10 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        {loading && <p className="text-sm text-gray-500">Loading post…</p>}
        {error && !loading && <p className="text-sm text-red-500">{error}</p>}

        {post && (
          <>
            <p className="text-xs text-gray-500 mb-2">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "Draft post"}
            </p>
            <h1 className="text-2xl md:text-3xl font-libre font-bold text-primary mb-4">
              {post.title}
            </h1>
            <div className="prose prose-sm max-w-none text-gray-800">
              <p>
                This area renders the body of the post. You can later replace this with a full
                Portable Text renderer for Sanity.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}



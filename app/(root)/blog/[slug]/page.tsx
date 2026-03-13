"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { sanityClient } from "@/lib/sanityClient"
import { PortableText } from "next-sanity"
import useRouter from "next/router"

type BlogPostDetail = {
  _id: string
  title: string
  body?: any
  publishedAt?: string
  image?: {
    asset?: {
      url?: string
    }
  }
}

const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  body,
  publishedAt,
  image
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
    <main className="min-h-screen bg-secondary px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        {loading && <p className="text-sm text-gray-500">Loading post…</p>}
        {error && !loading && <p className="text-sm text-red-500">{error}</p>}

        {post && (
          <>
      <p className="text-xs text-gray-500 mb-2">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString()
          : "Draft post"}
      </p>
      {post.image?.asset?.url && (
        <img
          src={post.image.asset.url}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-2xl md:text-3xl font-libre font-bold text-primary mb-4">
        {post.title}
      </h1>
      <div className="prose prose-sm max-w-none text-gray-800">
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      
      </div>
          </>
        )}
      </div>
    </main>
  )
}



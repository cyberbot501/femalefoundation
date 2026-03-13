"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type GalleryItem = {
  id: number
  title: string
  description: string | null
  image_url: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_items")
          .select("id, title, description, image_url")
          .order("id", { ascending: false })
        if (error) throw error
        setItems(data || [])
      } catch (err: any) {
        setError(
          "Unable to load gallery yet. Make sure the 'gallery_items' table and Supabase storage bucket are set up."
        )
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleDownload = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <main className="min-h-screen bg-secondary px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-libre font-bold text-primary">Gallery</h1>
            <p className="text-gray-600 max-w-2xl mt-2">
              Moments from our events, meetups, and everyday community life. All images are stored
              in Supabase and can be reused across the website.
            </p>
          </div>
        </header>

        {loading && <p className="text-sm text-gray-500">Loading images…</p>}
        {error && !loading && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-[4/3] cursor-pointer"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="text-white text-sm">
                  <p className="font-semibold">{item.title}</p>
                  {item.description && (
                    <p className="mt-1 text-xs leading-snug line-clamp-3">{item.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(item.image_url)}
                  className="self-end rounded-full bg-white/90 px-4 py-1 text-xs font-medium text-black hover:bg-white"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 && !error && (
          <p className="mt-8 text-sm text-gray-500">
            No images yet. Use the admin page to upload photos into the Supabase storage bucket and
            link them here.
          </p>
        )}
      </div>
    </main>
  )
}



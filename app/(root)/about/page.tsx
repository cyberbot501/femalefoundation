"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type AboutContent = {
  id: number
  headline: string
  subheadline: string
  body: string
  hero_image_url: string | null
  highlight_video_url: string | null
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("about_content")
          .select("id, headline, subheadline, body, hero_image_url, highlight_video_url")
          .single()

        if (error) throw error
        setContent(data)
      } catch (err: any) {
        setError("Unable to load About content yet. Configure the 'about_content' table in Supabase.")
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return (
    <main className="min-h-screen bg-secondary px-10 py-16">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-libre text-primary mb-4">
          {content?.headline || "About Our Community        "}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          {content?.subheadline ||
            "A safe, supportive space where women connect, grow, and build lasting impact together."}
        </p>

        <div className="grid md:grid-cols-[3fr,2fr] gap-10 items-start">
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line   ">
                {content?.body ||
                  "Use Supabase to manage this text. Create an 'about_content' table with headline, subheadline, and body fields, then edit everything from your admin page."}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Our Values</h2>
              <ul className="space-y-3 text-gray-700">
                <li>Support, mentorship, and practical opportunities for women.</li>
                <li>Spaces that feel safe, inclusive, and empowering.</li>
                <li>Programs that turn ideas into action and real community impact.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-4 h-[260px] flex items-center justify-center border border-dashed border-gray-300">
              {content?.hero_image_url ? (
                // You will replace this with a proper <Image> pointing to Supabase storage URL
                <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-500 text-center px-4">
                  Image from Supabase will appear here. Use the admin page to upload and link it.
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm max-w-xs">
                  Add your main About page picture here from Supabase storage. I left this box ready for your
                  image.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-sm font-medium text-gray-500 mb-3">Community Highlight Video</p>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                {content?.highlight_video_url ? (
                  <iframe
                    className="w-full h-full border-0"
                    src={content.highlight_video_url}
                    title="Community highlight video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <p className="text-gray-500 text-sm text-center px-4">
                    Paste your YouTube video link in Supabase (field: <span className="font-mono">highlight_video_url</span>) and
                    it will show here automatically.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-gray-500">Loading About content…</p>}
        {error && !loading && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </section>
    </main>
  )
}



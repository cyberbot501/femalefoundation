"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import founder from "@/app/asset/kola.jpeg"
import Image from "next/image"

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
    <main className="min-h-screen bg-secondary px-4 py-12 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold font-libre text-primary mb-4">
          About Female Network Foundation
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          A safe, supportive space where women connect, grow, and build lasting impact together.
        </p>

        <div className="grid md:grid-cols-[3fr,2fr] gap-10 items-start">
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line   ">
                Founded and registered by Oluwaseun Kola Akinola in 2024, CAC (RN: 8191592) and SCUML (RN: SC 131401223), with headquarters in Ado Ekiti, Ekiti State, Nigeria, Female Network Foundation  is committed to empowering women by providing resources in technology, gender advocacy, and personal development.<br /><br />

                Our mission is aligned with the United Nations Sustainable Development Goals (SDGs), particularly Goals 5, 4, and 8, to create a safe and inclusive space where women can embrace their identity, grow personally and professionally, and break free from societal limitations.<br /><br />

                Female Network Foundation is a non-profit organization devoted to empowering women through personal growth, self-discovery, and transformation. We provide a safe and supportive space for women to rebuild their sense of self-worth, explore their identity, and achieve personal and professional success.<br /><br />

                Since our founding, we have positively impacted the lives of over 2,000 women through various conferences, webinars, and virtual events. Our community is home to nearly 150 active members who participate in our programs and support one another on their journey toward self-empowerment and gender advocacy.<br /><br />

                Our initiatives cover essential areas such as:<br />

                Mental health<br />

                Financial independence<br />

                Creativity<br />

                Self-expression<br /><br />

                Through the Women Identity Conference, we help women redefine their identities and build self-confidence. We also organize mental health workshops and financial independence webinars to equip women with the tools they need to navigate life’s challenges and gain financial control.<br /><br />

                In addition, we celebrate the power of creativity as a form of healing and self-expression, encouraging women to explore their passions and talents.

                With a strong commitment to making a lasting difference, we have reached women globally through media and virtual platforms. Our programs have allowed us to build meaningful connections, create a supportive community, and inspire women to embrace their true selves.

                We are continuously evolving and growing, dedicated to transforming the lives of more women by providing resources, education, and opportunities for personal and professional growth.
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
            <div className="bg-white rounded-2xl shadow-sm p-4 md:h-[600px] h-[500px] flex items-center justify-center border border-dashed border-gray-300">
              <Image src={founder} alt="Founder Kola" className="w-full md:h-full h-[450px] object-fit" />

            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-sm font-medium text-gray-500 mb-3">Community Highlight Video</p>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">

                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/hszTinXEAZ4"
                  title="Community Highlight Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>

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



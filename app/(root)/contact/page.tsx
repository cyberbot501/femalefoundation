"use client"

import { FormEvent, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const message = String(formData.get("message") || "").trim()

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name,
        phone,
        message,
      })
      if (error) throw error
      setSuccess("Your message has been sent. We’ll get back to you soon.")
      e.currentTarget.reset()
    } catch (err) {
      setError("We couldn’t send your message yet. Please try again.")
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-secondary px-10 py-16">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-10 grid md:grid-cols-2 gap-10">
        <section>
          <h1 className="text-3xl font-libre font-bold text-primary mb-3">Contact Us</h1>
          <p className="text-gray-600 text-sm mb-6">
            Reach out to us for collaborations, questions, or to learn more about how you can be
            involved in the community.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-semibold">Connect on social media</p>
            <ul className="space-y-1">
              <li>Instagram: @yourhandle</li>
              <li>Twitter: @yourhandle</li>
              <li>Email: hello@example.com</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="WhatsApp or phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="What would you like to tell us?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>

          {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </section>
      </div>
    </main>
  )
}



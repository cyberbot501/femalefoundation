"use client"

import { FormEvent, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function JoinPage() {
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
    const email = String(formData.get("email") || "").trim()
    const interest = String(formData.get("interest") || "").trim()

    try {
      const { error } = await supabase.from("community_members").insert({
        name,
        phone,
        email,
        interest,
      })
      if (error) throw error
      setSuccess("Thank you for joining the community! We’ll be in touch soon.")
      e.currentTarget.reset()
    } catch (err: unknown) {
      setError("We couldn’t submit your details yet. Please try again.")
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-secondary px-10 py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-10">
        <h1 className="text-3xl md:text-4xl font-libre font-bold text-primary mb-3">
          Join Our Community
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Fill in your details to become part of the Female Foundation community. We’ll use this
          information to keep you updated about programs, events, and opportunities.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Optional, but helpful"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="interest">
              What would you like to gain or give in this community?
            </label>
            <textarea
              id="interest"
              name="interest"
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Tell us briefly how you want to be involved."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit details"}
          </button>
        </form>

        {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </main>
  )
}



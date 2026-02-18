"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type EventItem = {
  id: number
  title: string
  description: string | null
  date: string
  location: string | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, title, description, date, location")
          .order("date", { ascending: true })
        if (error) throw error
        setEvents(data || [])
      } catch (err: unknown) {
        setError("Unable to load events yet. Make sure the 'events' table exists in Supabase.")
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const { upcoming, past } = useMemo(() => {
    const now = new Date()
    const upcomingEvents: EventItem[] = []
    const pastEvents: EventItem[] = []

    events.forEach((ev) => {
      const date = new Date(ev.date)
      if (date >= new Date(now.toDateString())) {
        upcomingEvents.push(ev)
      } else {
        pastEvents.push(ev)
      }
    })

    return { upcoming: upcomingEvents, past: pastEvents }
  }, [events])

  const renderCard = (ev: EventItem) => (
    <div key={ev.id} className="rounded-2xl bg-white shadow-sm p-5 space-y-2">
      <p className="text-xs uppercase tracking-wide text-accent">
        {new Date(ev.date).toLocaleDateString()}
      </p>
      <h3 className="text-lg font-semibold text-primary">{ev.title}</h3>
      {ev.location && <p className="text-xs text-gray-500">{ev.location}</p>}
      {ev.description && <p className="text-sm text-gray-700 mt-2">{ev.description}</p>}
    </div>
  )

  return (
    <main className="min-h-screen bg-secondary px-10 py-16">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-libre font-bold text-primary">Events</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            See what is coming up and look back at the events we have already hosted. Once the date
            has passed, events automatically move into the “Past events” section.
          </p>
        </header>

        {loading && <p className="text-sm text-gray-500">Loading events…</p>}
        {error && !loading && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-primary mb-4">Upcoming events</h2>
          {upcoming.length === 0 && !loading ? (
            <p className="text-sm text-gray-500">No upcoming events yet.</p>
          ) : (
            <div className="space-y-4">{upcoming.map(renderCard)}</div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">Past events</h2>
          {past.length === 0 && !loading ? (
            <p className="text-sm text-gray-500">No past events yet.</p>
          ) : (
            <div className="space-y-4">{past.map(renderCard)}</div>
          )}
        </section>
      </div>
    </main>
  )
}



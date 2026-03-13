"use client"

import { FormEvent, useEffect, useState } from "react"
import { jsPDF } from "jspdf"
import { supabase } from "@/lib/supabaseClient"

type Member = {
  id: number
  name: string
  phone: string
  email: string | null
  interest: string | null
}

type AboutContent = {
  id: number
  headline: string
  subheadline: string
  body: string
  hero_image_url: string | null
  highlight_video_url: string | null
}

type GalleryItem = {
  id: number
  title: string
  description: string | null
  image_url: string
}

type EventItem = {
  id: number
  title: string
  description: string | null
  date: string
  location: string | null
  image_url: string | null
}

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [membersError, setMembersError] = useState<string | null>(null)

  const [about, setAbout] = useState<AboutContent | null>(null)
  const [aboutLoading, setAboutLoading] = useState(true)
  const [aboutSaving, setAboutSaving] = useState(false)
  const [aboutMessage, setAboutMessage] = useState<string | null>(null)

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [gallerySaving, setGallerySaving] = useState(false)

  const [events, setEvents] = useState<EventItem[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [eventsSaving, setEventsSaving] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("community_members")
          .select("id, name, phone, email, interest")
          .order("id", { ascending: false })
        if (error) throw error
        setMembers(data || [])
      } catch {
        setMembersError("Unable to load members. Check the 'community_members' table in Supabase.")
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchMembers()
  }, [])

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from("about_content")
          .select("id, headline, subheadline, body, hero_image_url, highlight_video_url")
          .single()
        if (error && error.code !== "PGRST116") throw error
        if (data) {
          setAbout(data as AboutContent)
        }
      } catch {
        setAboutMessage(
          "Unable to load About content. Make sure the 'about_content' table exists in Supabase."
        )
      } finally {
        setAboutLoading(false)
      }
    }

    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_items")
          .select("id, title, description, image_url")
          .order("id", { ascending: false })
        if (error) throw error
        setGalleryItems((data || []) as GalleryItem[])
      } catch {
        setGalleryError(
          "Unable to load gallery items. Make sure the 'gallery_items' table and storage bucket exist."
        )
      } finally {
        setGalleryLoading(false)
      }
    }

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, title, description, date, location, image_url")
          .order("date", { ascending: true })
        if (error) throw error
        setEvents((data || []) as EventItem[])
      } catch {
        setEventsError("Unable to load events. Check the 'events' table in Supabase.")
      } finally {
        setEventsLoading(false)
      }
    }

    fetchAbout()
    fetchGallery()
    fetchEvents()
  }, [])

  const downloadMembersPdf = () => {
    const doc = new jsPDF()

    doc.setFontSize(14)
    doc.text("Female Foundation - Community Members", 14, 16)

    doc.setFontSize(10)
    let y = 26

    members.forEach((m, index) => {
      const line = `${index + 1}. ${m.name} | ${m.phone} | ${m.email || ""}`
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, 14, y)
      y += 6
    })

    doc.save("community-members.pdf")
  }

  const handleSaveAbout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const headline = String(formData.get("headline") || "").trim()
    const subheadline = String(formData.get("subheadline") || "").trim()
    const body = String(formData.get("body") || "").trim()
    const highlight_video_url = String(formData.get("highlight_video_url") || "").trim() || null

    setAboutSaving(true)
    setAboutMessage(null)

    try {
      if (about?.id) {
        const { error } = await supabase
          .from("about_content")
          .update({ headline, subheadline, body, highlight_video_url })
          .eq("id", about.id)
        if (error) throw error
        setAbout({ ...(about as AboutContent), headline, subheadline, body, highlight_video_url })
      } else {
        const { data, error } = await supabase
          .from("about_content")
          .insert([{ headline, subheadline, body, highlight_video_url }])
          .select("id, headline, subheadline, body, hero_image_url, highlight_video_url")
          .single()
        if (error) throw error
        setAbout(data as AboutContent)
      }
      setAboutMessage("About content saved successfully.")
    } catch {
      setAboutMessage("We could not save the About content. Please try again.")
    } finally {
      setAboutSaving(false)
    }
  }

  const refreshGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id, title, description, image_url")
        .order("id", { ascending: false })
      if (error) throw error
      setGalleryItems((data || []) as GalleryItem[])
    } catch {
      setGalleryError(
        "Unable to refresh gallery items. Please check the 'gallery_items' table and storage bucket."
      )
    }
  }

  const handleCreateGalleryItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim() || null
    const file = formData.get("image") as File | null

    if (!file) {
      setGalleryError("Please select an image to upload.")
      return
    }

    setGallerySaving(true)
    setGalleryError(null)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { data: storageData, error: storageError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file)
      if (storageError) throw storageError

      const { data: publicUrlData } = supabase.storage.from("gallery").getPublicUrl(storageData.path)
      const image_url = publicUrlData.publicUrl

      const { error } = await supabase
        .from("gallery_items")
        .insert([{ title, description, image_url }])
      if (error) throw error

      ;(e.target as HTMLFormElement).reset()
      await refreshGallery()
    } catch {
      setGalleryError(
        "We could not upload this image. Please confirm the 'gallery' storage bucket exists and try again."
      )
    } finally {
      setGallerySaving(false)
    }
  }

  const handleCreateEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim() || null
    const date = String(formData.get("date") || "").trim()
    const location = String(formData.get("location") || "").trim() || null
    const file = formData.get("eventImage") as File | null

    setEventsSaving(true)
    setEventsError(null)

    try {
      let image_url: string | null = null

      if (file && file.size > 0) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        const { data: storageData, error: storageError } = await supabase.storage
          .from("event-images")
          .upload(fileName, file)
        if (storageError) throw storageError

        const { data: publicUrlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(storageData.path)
        image_url = publicUrlData.publicUrl
      }

      const { data, error } = await supabase
        .from("events")
        .insert([{ title, description, date, location, image_url }])
        .select("id, title, description, date, location, image_url")
        .single()
      if (error) throw error

      setEvents(prev => [...prev, data as EventItem].sort((a, b) => a.date.localeCompare(b.date)))
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setEventsError("We could not create this event. Please try again.")
    } finally {
      setEventsSaving(false)
    }
  }

  const handleStartEditEvent = (event: EventItem) => {
    setEditingEvent({ ...event })
  }

  const handleChangeEditingEvent = (field: keyof EventItem, value: string) => {
    if (!editingEvent) return
    setEditingEvent({ ...editingEvent, [field]: value })
  }

  const handleSaveEventEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingEvent) return

    setEventsSaving(true)
    setEventsError(null)

    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: editingEvent.title,
          description: editingEvent.description,
          date: editingEvent.date,
          location: editingEvent.location,
        })
        .eq("id", editingEvent.id)
      if (error) throw error

      setEvents(prev =>
        prev
          .map(ev => (ev.id === editingEvent.id ? editingEvent : ev))
          .sort((a, b) => a.date.localeCompare(b.date))
      )
      setEditingEvent(null)
    } catch {
      setEventsError("We could not update this event. Please try again.")
    } finally {
      setEventsSaving(false)
    }
  }

  const handleDeleteEvent = async (id: number) => {
    setEventsSaving(true)
    setEventsError(null)
    try {
      const { error } = await supabase.from("events").delete().eq("id", id)
      if (error) throw error
      setEvents(prev => prev.filter(ev => ev.id !== id))
      if (editingEvent?.id === id) {
        setEditingEvent(null)
      }
    } catch {
      setEventsError("We could not delete this event. Please try again.")
    } finally {
      setEventsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-secondary px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-libre font-bold text-primary">Admin dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Manage your community. See members, update About page content, maintain the gallery, and
            create or update events shown on the public site.
          </p>
        </header>

        {/* Members */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-primary">Community members</h2>
              <p className="text-xs text-gray-500">
                Fetched from the <span className="font-mono">community_members</span> table in
                Supabase.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadMembersPdf}
              className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
              disabled={members.length === 0}
            >
              Download as PDF
            </button>
          </div>

          {loadingMembers && <p className="text-sm text-gray-500">Loading members…</p>}
          {membersError && !loadingMembers && (
            <p className="mb-4 text-sm text-red-500">{membersError}</p>
          )}

          {!loadingMembers && members.length === 0 && !membersError && (
            <p className="text-sm text-gray-500">No members yet.</p>
          )}

          {members.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Phone</th>
                    <th className="px-3 py-2 text-left font-medium">Email</th>
                    <th className="px-3 py-2 text-left font-medium">Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{m.name}</td>
                      <td className="px-3 py-2">{m.phone}</td>
                      <td className="px-3 py-2">{m.email}</td>
                      <td className="max-w-xs truncate px-3 py-2">{m.interest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* About content */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-primary">About page content</h2>
          <p className="mb-4 text-xs text-gray-500">
            This controls the text and video link on the public About page. Data is stored in the{" "}
            <span className="font-mono">about_content</span> table.
          </p>

          {aboutLoading ? (
            <p className="text-sm text-gray-500">Loading About content…</p>
          ) : (
            <form onSubmit={handleSaveAbout} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="headline">
                  Headline
                </label>
                <input
                  id="headline"
                  name="headline"
                  defaultValue={about?.headline}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="About our community"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="subheadline">
                  Subheadline
                </label>
                <input
                  id="subheadline"
                  name="subheadline"
                  defaultValue={about?.subheadline}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Short description shown under the heading"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="body">
                  Main body text
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={6}
                  defaultValue={about?.body}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Longer description of your mission, story, and values."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="highlight_video_url">
                  Highlight video URL (YouTube)
                </label>
                <input
                  id="highlight_video_url"
                  name="highlight_video_url"
                  defaultValue={about?.highlight_video_url || ""}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Paste the full embed URL or a normal YouTube link. It will appear on the About
                  page.
                </p>
              </div>

              <button
                type="submit"
                disabled={aboutSaving}
                className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {aboutSaving ? "Saving…" : "Save About content"}
              </button>

              {aboutMessage && <p className="text-sm text-gray-600">{aboutMessage}</p>}
            </form>
          )}
        </section>

        {/* Gallery */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-primary">Gallery</h2>
          <p className="mb-4 text-xs text-gray-500">
            Upload new images and captions. Images are stored in the{" "}
            <span className="font-mono">gallery</span> storage bucket, and linked via the{" "}
            <span className="font-mono">gallery_items</span> table.
          </p>

          <form onSubmit={handleCreateGalleryItem} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Event or moment title"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="image">
                  Image file
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="description">
                Caption (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Short description or context for this image."
              />
            </div>

            <button
              type="submit"
              disabled={gallerySaving}
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {gallerySaving ? "Uploading…" : "Add to gallery"}
            </button>
          </form>

          {galleryError && <p className="mt-4 text-sm text-red-500">{galleryError}</p>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryLoading && <p className="text-sm text-gray-500">Loading gallery items…</p>}
            {!galleryLoading &&
              galleryItems.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                >
                  <div className="aspect-[4/3] w-full bg-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 px-3 py-3">
                    <p className="text-xs text-gray-500">#{item.id}</p>
                    <p className="text-sm font-medium text-primary">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Events */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-primary">Events</h2>
          <p className="mb-4 text-xs text-gray-500">
            Events created here appear on the public Events page. Stored in the{" "}
            <span className="font-mono">events</span> table.
          </p>

          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="event-title">
                  Title
                </label>
                <input
                  id="event-title"
                  name="title"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Community meetup, workshop, etc."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="event-date">
                  Date
                </label>
                <input
                  id="event-date"
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="event-location">
                  Location (optional)
                </label>
                <input
                  id="event-location"
                  name="location"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Online, Lagos, etc."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="event-description">
                  Description
                </label>
                <textarea
                  id="event-description"
                  name="description"
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="What is this event about?"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="event-image">
                Event image (optional)
              </label>
              <input
                id="event-image"
                name="eventImage"
                type="file"
                accept="image/*"
                className="w-full text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                This image will appear on the Events page for this event.
              </p>
            </div>

            <button
              type="submit"
              disabled={eventsSaving}
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {eventsSaving ? "Saving…" : "Create event"}
            </button>
          </form>

          {eventsError && <p className="mt-4 text-sm text-red-500">{eventsError}</p>}

          <div className="mt-6 space-y-3">
            {eventsLoading && <p className="text-sm text-gray-500">Loading events…</p>}
            {!eventsLoading && events.length === 0 && !eventsError && (
              <p className="text-sm text-gray-500">No events yet.</p>
            )}

            {!eventsLoading &&
              events.map(ev => (
                <div
                  key={ev.id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-accent">
                      {new Date(ev.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-semibold text-primary">{ev.title}</p>
                    {ev.location && (
                      <p className="text-xs text-gray-500">Location: {ev.location}</p>
                    )}
                    {ev.description && (
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ev.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditEvent(ev)}
                      className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {editingEvent && (
            <form onSubmit={handleSaveEventEdit} className="mt-6 space-y-4 rounded-xl bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-primary">
                Edit event – <span className="font-normal">#{editingEvent.id}</span>
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="edit-title">
                    Title
                  </label>
                  <input
                    id="edit-title"
                    value={editingEvent.title}
                    onChange={e => handleChangeEditingEvent("title", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="edit-date">
                    Date
                  </label>
                  <input
                    id="edit-date"
                    type="date"
                    value={editingEvent.date.slice(0, 10)}
                    onChange={e => handleChangeEditingEvent("date", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="edit-location">
                    Location
                  </label>
                  <input
                    id="edit-location"
                    value={editingEvent.location || ""}
                    onChange={e => handleChangeEditingEvent("location", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="edit-description">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    rows={3}
                    value={editingEvent.description || ""}
                    onChange={e => handleChangeEditingEvent("description", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={eventsSaving}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
                >
                  {eventsSaving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}


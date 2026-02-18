"use client"

import { useEffect, useState } from "react"
import { jsPDF } from "jspdf"
import { supabase } from "@/lib/supabaseClient"

type Member = {
  id: number
  name: string
  phone: string
  email: string | null
  interest: string | null
}

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [membersError, setMembersError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("community_members")
          .select("id, name, phone, email, interest")
          .order("id", { ascending: false })
        if (error) throw error
        setMembers(data || [])
      } catch (err: unknown) {
        setMembersError("Unable to load members. Check the 'community_members' table in Supabase.")
        // eslint-disable-next-line no-console
                   
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchMembers()
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

  return (
    <main className="min-h-screen bg-secondary px-10 py-16">
      <div className="max-w-6xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-libre font-bold text-primary">Admin dashboard</h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            This page is for admins only. From here you can see who joined the community and export
            the list as PDF. You can also extend this page later to manage About content, gallery,
            events and more.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
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
            <p className="text-sm text-red-500 mb-4">{membersError}</p>
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
                  {members.map((m) => (
                    <tr key={m.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{m.name}</td>
                      <td className="px-3 py-2">{m.phone}</td>
                      <td className="px-3 py-2">{m.email}</td>
                      <td className="px-3 py-2 max-w-xs truncate">{m.interest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary mb-2">Other admin sections</h2>
          <p className="text-sm text-gray-600">
            You can extend this page to:
            <br />
            – Edit About page text and video link stored in Supabase.
            <br />
            – Upload gallery images to Supabase storage and create captions.
            <br />
            – Create and update events for the Events page.
          </p>
        </section>
      </div>
    </main>
  )
}



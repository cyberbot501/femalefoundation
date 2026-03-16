"use client"

import Image from "next/image"
import { FormEvent, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import logo from "@/app/asset/logo.jpg"

export default function DonatePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleBankTransfer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") || "").trim()
    const amount = Number(formData.get("amount") || 0)
    const file = formData.get("receipt") as File | null

    try {
      let receiptUrl: string | null = null

      if (file && file.size > 0) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const { data: storageData, error: storageError } = await supabase.storage
          .from("donation-receipts")
          .upload(fileName, file)

        if (storageError) throw storageError

        const { data: publicUrlData } = supabase.storage
          .from("donation-receipts")
          .getPublicUrl(storageData.path)

        receiptUrl = publicUrlData.publicUrl
      }

      const { error } = await supabase.from("donations").insert({
        name,
        amount,
        method: "bank_transfer",
        receipt_url: receiptUrl,
      })
      if (error) throw error

      setSuccess("Thank you for your donation and for sending your receipt.")
      e.currentTarget.reset()
    } catch (err: any) {
      setError("We could not record your donation yet. Please try again.")
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-secondary px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Female Foundation logo" width={48} height={48} />
            <div>
              <h1 className="text-2xl font-libre font-bold text-primary">Support the Vision</h1>
              <p className="text-gray-600 text-sm">
                Every donation helps us create safe spaces, programs, and opportunities for women.
              </p>
            </div>
          </div>
          <button className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white">
            Donate
          </button>
        </header>

        <div className="grid md:grid-cols-2 gap-10 mt-4">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">Bank Transfer Details</h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium">Account Name:</span> Female Network
              </p>
              <p>
                <span className="font-medium">Bank:</span> UNITED BANK FOR AFRICA (UBA)
              </p>
              <p>
                <span className="font-medium">Account Number:</span> 1029637741
              </p>
              <p className="text-xs text-gray-500 mt-2">
                After you make a transfer, please upload your receipt on this page so we can confirm
                and record your donation.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-xs text-gray-500">
              <p className="font-semibold mb-1">Card / Paystack</p>
              <p>
                Card donations through Paystack will be available soon. For now, please use bank
                transfer and upload your receipt.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-4">Upload Your Transfer Receipt</h2>
            <form onSubmit={handleBankTransfer} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Name used for the transfer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="amount">
                  Amount sent
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="receipt">
                  Upload transfer receipt
                </label>
                <input
                  id="receipt"
                  name="receipt"
                  type="file"
                  accept="image/*,application/pdf"
                  className="w-full text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit receipt"}
              </button>
            </form>

            {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </section>
        </div>
      </div>
    </main>
  )
}



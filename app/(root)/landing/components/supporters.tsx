export default function CallToAction() {
  return (
    <section className="bg-accent py-20">
      <div className="max-w-6xl mx-auto px-8 text-center text-white">
        <h2 className="text-3xl font-libre font-semibold">
          Be Part of Something Meaningful
        </h2>
        <p className="mt-4  text-white/80">
          Join a growing network of women supporting women across industries.
        </p>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="border border-white/40 rounded-lg p-6 w-64">
            <h3 className="font-semibold">Membership</h3>
            <p className="text-sm text-white/80 mt-2">
              Connect, learn, and grow together.
            </p>
          </div>

          <div className="border border-white/40 rounded-lg p-6 w-64">
            <h3 className="font-semibold">Partner With Us</h3>
            <p className="text-sm text-white/80 mt-2">
              Support women-led initiatives.
            </p>
          </div>

          <div className="border border-white/40 rounded-lg p-6 w-64">
            <h3 className="font-semibold">Support Us</h3>
            <p className="text-sm text-white/80 mt-2">
              Help us expand our impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
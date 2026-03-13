export default function Highlight() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-10">
        <h2 className="text-2xl font-libre font-semibold text-textPrimary sm:text-3xl">
          Highlights from Our Community
        </h2>

        <div className="mt-12 flex justify-center">
          {/* Replace with video or image */}
          <div className="aspect-video w-full max-w-[560px] rounded-xl bg-gray-200" />
        </div>
      </div>
    </section>
  )
}
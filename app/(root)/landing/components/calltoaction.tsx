export default function Highlight() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-10">
        <h2 className="text-2xl font-libre font-semibold text-textPrimary sm:text-3xl">
          Highlights from Our Community
        </h2>

        <div className="mt-12 flex justify-center">
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
    </section>
  )
}
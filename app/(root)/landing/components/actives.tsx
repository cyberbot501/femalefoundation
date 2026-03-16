    "use client"

    import { motion } from "framer-motion"
    import Image from "next/image"
    import school from "@/app/asset/school.jpeg"
    import Reusable from "@/app/asset/ekiti.jpeg"
    import vine from "@/app/asset/vine.jpg"
    import meetup from "@/app/asset/meetup.jpg"

    const items = [
    { id: 1, title: "School Visit", img: school },
    { id: 2, title: "Reusable Pad Workshop", img: Reusable },
    { id: 3, title: "Living Vine Meetup", img: vine },
    { id: 4, title: "Community Meetup", img: meetup },
    ]

    export default function ActivitiesSection() {
    return (
        <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-center text-xl font-medium mb-12">
            Find out what our community is up to
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-ful mx-auto">
            {items.map((item) => (
                <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-xl overflow-hidden cursor-pointer"
                >
                <Image
                    src={item.img}
                    alt={item.title}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                    <p className="text-white text-sm">{item.title}</p>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
        </section>
    )
    }
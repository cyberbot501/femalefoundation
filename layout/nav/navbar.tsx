"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/app/asset/logo.jpg"
import { Button } from "@/components/ui/button"

const links = [
  { label: "Home", href: "/" },
  { label: "Donate", href: "/donate" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full">
      <div className="bg-accent text-background">
        <p className="flex items-center justify-center px-4 py-2 text-center text-sm font-bold font-libre sm:text-base">
          Female Foundation – coming together to make it work
        </p>
      </div>

      <div className="w-full bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Female Foundation logo" width={40} height={40} />
            <span className=" text-sm font-semibold text-gray-800 sm:inline-block">
              Female Foundation
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center space-x-6">
              {links.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-inter font-medium text-gray-600 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

           
          </nav>


           <Button className="hidden md:block bg-accent text-white" asChild>
              <Link href="/join">Join Our Community</Link>
            </Button>

          <button
            type="button"
            className="inline-flex items-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open main menu</span>
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 bg-gray-800" />
              <span className="h-0.5 w-5 bg-gray-800" />
              <span className="h-0.5 w-5 bg-gray-800" />
            </div>
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-100 bg-white md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6 lg:px-10">
              {links.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button className="mt-2 w-full bg-accent text-white" asChild>
                <Link href="/join" onClick={() => setOpen(false)}>
                  Join Our Community
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

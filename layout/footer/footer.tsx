import Link from "next/link"
import Image from "next/image"
import logo from "@/app/asset/logo.jpg"



export default function Footer() {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Female Foundation logo" width={40} height={40} className="rounded-full" />
            <span className="font-libre text-lg font-semibold">Female Foundation</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Building a safe, supportive community where women connect, grow, and create lasting impact together.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
              Navigate
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-accent-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/donate" className="transition-colors hover:text-accent-foreground">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-accent-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
              Community
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/gallery" className="transition-colors hover:text-accent-foreground">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition-colors hover:text-accent-foreground">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-accent-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/join" className="transition-colors hover:text-accent-foreground">
                  Join our community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
              Connect
            </h3>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Follow us on social media and stay updated about new programs and events.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-primary-foreground/80">
             

               <li><Link href ='https://www.facebook.com/share/1HpNd6vNmb/'>Facebook: @fnfee-foundation </Link></li>
                            <li><Link href ='https://www.linkedin.com/company/fnfee-foundation/'>Linkedin: @fnfee-foundation </Link></li>
                            <li><Link href='https://chat.whatsapp.com/HM1Z0qWPHuxKCqlUo7wSui'>WhatsApp </Link></li>
                            <li><Link href ='https://x.com/fnfeefoundation?t=_AWYBsk70BlR9XXsWxHCdw&s=09'>Twitter: @fnfee_foundation </Link></li>
                            <li><Link href ='https://www.instagram.com/fnfee_foundation?igsh=NTFubzlycWt4Y3Ix'>Instagram: @fnfee_foundation </Link></li>
              
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-primary-foreground/70 sm:flex-row sm:px-6 lg:px-10">
          <p>© {new Date().getFullYear()} Female Foundation. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Crafted with care for women supporting women.
          </p>
        </div>
      </div>
    </footer>
  )
}




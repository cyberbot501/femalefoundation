import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/app/asset/logo.jpg'
import { Button } from '@/components/ui/button'

export default function navbar() {
    const Nav = [
        {
            Value: "Home",
            links: "/"
        },

         {
            Value: "Donate",
            links: "/donate"
        },


         {
            Value: "About",
            links: "/about"
        },

         {
            Value: "Blog",
            links: "/blog"
        },
        {
            Value: "Gallery",
            links: "/gallery"
        },
        {
            Value: "Contact",
            links: "/contact"
        },

    ]
  return (
    <div>
        <div>
            <p className='text-[18px] bg-accent h-[50px] w-full text-center flex items-center justify-center font-bold text-background font-libre '>Female Foundation Coming Together to Make it Work</p>
        </div>


        <div className='px-10 w-full h-[70px] bg-white '>
          
         <div className='flex flex-row justify-between items-center h-full'>
             <Image src={logo} alt='' width={50} height={50} />


            <ul className="flex space-x-8">
                {Nav.map((item, index) => (
                    <li key={index}>
                        <Link className='text-[16px] text-gray-500 font-inter font-medium  ' href={item.links}>{item.Value}</Link>
                    </li>
                ))}
            </ul>

            <Button className='bg-accent' asChild>
              <Link href="/join">
                Join Our Community
              </Link>
            </Button>
         </div>
            
        </div>
 
    </div>
  )
}

import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
  return (
    <nav className="container mx-auto lg:px-2 px-5 lg:w-2/5">
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="text-2xl font-medium">
          shincode
        </Link>
        <div className="">
          <ul className="flex items-center text-sm py-4">
            <li className="block px-4 py-2 hover:text-sky-900 transition-all duration-300">
              <Link href="/">Home</Link>
            </li>
            <li className="block px-4 py-2 hover:text-sky-900 transition-all duration-300">
              <Link href="/">Twitter</Link>
            </li>
            <li className="block px-4 py-2 hover:text-sky-900 transition-all duration-300">
              <Link href="#">Qiita</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

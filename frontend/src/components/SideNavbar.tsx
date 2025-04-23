'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import useAuthStore from '@/store/Auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/images', label: 'Images' },
  { href: '/videos', label: 'Videos' },
  { href: '/documents', label: 'Documents' },
  // { href: '/trash', label: 'Trash' },
  // { href: '/settings', label: 'Settings' },
]

const SideNavbar = () => {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  const {authCheck} = useAuthStore()
  useEffect(() => {
    authCheck()
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const renderLinks = () => (
    <ul className="space-y-2 mt-4">
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <li key={href}>
            <Link
              href={href}
              className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gray-500 font-semibold'
                  : 'hover:bg-gray-600'
              }`}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  if (!isClient) return null

  return (
    <>
      {/* Mobile: Sheet trigger */}
      <div className="md:hidden fixed top-18 left-1 z-50 flex items-center justify-between   shadow-2xl">
        {/* <h2 className="text-xl font-bold">Add</h2> */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className=" w-44 p-4 overflow-y-auto"
          >
            <SheetHeader>
              {/* <SheetTitle className="text-white">Add</SheetTitle> */}
            </SheetHeader>
            {renderLinks()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 m-2 mt-10 h-screen fixed top-0 left-0 border-r border-r-cyan-600  p-4 shadow-lg">    
        {renderLinks()}
      </div>
    </>
  )
}

export default SideNavbar

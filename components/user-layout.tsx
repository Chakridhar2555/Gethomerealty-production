"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface UserLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: "grid" },
  { name: "Leads", href: "/user/leads", icon: "users" },
  { name: "Calendar", href: "/user/calendar", icon: "calendar" },
  { name: "Email", href: "/user/email", icon: "mail" },
  { name: "Inventory", href: "/user/inventory", icon: "box" },
  { name: "Settings", href: "/user/settings", icon: "settings" },
]

export function UserLayout({ children }: UserLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 hidden w-72 overflow-y-auto border-r border-gray-200 bg-white lg:block">
        <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
          <Link href="/user/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-semibold">GetHome</span>
            <span className="text-gray-500">Realty</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7 px-6 py-4">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? "bg-gray-50 text-primary"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                    >
                      <span className="material-icons-outlined text-xl">
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-gray-900/80" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/user/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-semibold">GetHome</span>
              <span className="text-gray-500">Realty</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          <nav className="mt-6">
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-gray-50 text-primary"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <span className="material-icons-outlined text-xl">
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
} 
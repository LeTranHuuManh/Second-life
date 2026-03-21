'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Heart, ShoppingCart, Calendar, History, Bell, Settings, Menu } from 'lucide-react'
import { useState } from 'react'

const MENU_ITEMS = [
  { icon: ShoppingBag, label: 'My Products', href: '/dashboard' },
  { icon: Heart, label: 'Favorites', href: '/dashboard/favorites' },
  { icon: ShoppingCart, label: 'Cart', href: '/dashboard/cart' },
  { icon: Calendar, label: 'Rentals', href: '/dashboard/rentals' },
  { icon: ShoppingBag, label: 'Orders', href: '/dashboard/orders' },
  { icon: History, label: 'History', href: '/dashboard/history' },
]

const BOTTOM_ITEMS = [
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden bg-white p-2 rounded-lg border border-border"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 top-16 w-64 bg-white border-r border-border p-6 transform transition-transform duration-300 md:translate-x-0 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:top-0 flex flex-col`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden text-muted-foreground hover:text-foreground"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Main Menu */}
        <nav className="space-y-2 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
            Menu
          </p>
          {MENU_ITEMS.map(item => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Menu */}
        <nav className="space-y-2 border-t border-border pt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
            Other
          </p>
          {BOTTOM_ITEMS.map(item => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

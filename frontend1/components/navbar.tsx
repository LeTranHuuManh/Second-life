'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut } from 'lucide-react'

export function Navbar() {
  const { user, logout, setRole } = useAuth()

  const handleDemoAdmin = () => {
    setRole('admin')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">SH</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">SwiftHub</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg bg-secondary/20 border border-secondary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-6">
            {user ? (
              <>
                {user.role === 'user' && (
                  <Link
                    href="/cart"
                    className="relative text-foreground hover:text-primary transition-colors"
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 text-xs bg-destructive text-white rounded-full flex items-center justify-center">
                      2
                    </span>
                  </Link>
                )}
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-secondary"
                  />
                </div>
                <div className="flex gap-2">
                  {user.role === 'user' && (
                    <Button
                      onClick={handleDemoAdmin}
                      variant="outline"
                      size="sm"
                      className="text-xs hidden sm:inline-flex"
                    >
                      Demo Admin
                    </Button>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" className="hidden sm:inline">
                      <Button size="sm" className="text-xs">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(MOCK_PRODUCTS.slice(0, 3))

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex pt-16">
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Favorites</h1>
              <p className="text-muted-foreground">
                {favorites.length} items saved for later
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg mb-4">No favorites yet</p>
                <Link href="/">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Image */}
                    <Link href={`/products/${product.id}`}>
                      <div className="relative h-48 overflow-hidden bg-secondary/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                        <button
                          onClick={e => {
                            e.preventDefault()
                            removeFavorite(product.id)
                          }}
                          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-md"
                          aria-label="Remove from favorites"
                        >
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </button>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-3">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-accent text-accent'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Price and Button */}
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={e => {
                            e.preventDefault()
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

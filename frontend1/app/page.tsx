'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { Star, Filter, ChevronRight } from 'lucide-react'

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Sports', 'Home']

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts = selectedCategory === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">SwiftHub</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Buy premium products, rent for less, and start earning. Your marketplace for everything you need.
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Browse Now
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-secondary overflow-hidden hidden md:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🛍️</div>
                  <p className="text-muted-foreground">Marketplace Illustration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Categories</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Featured Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-6 opacity-90">Join thousands of users buying and renting on SwiftHub</p>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-secondary/10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            ${product.price}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
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
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Seller */}
          <div className="flex items-center gap-2 mt-3">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-muted-foreground">{product.seller.name}</span>
          </div>

          {/* Footer */}
          <div className="flex gap-2 mt-4">
            <Button className="flex-1" size="sm">
              Buy
            </Button>
            {product.rentPrice && (
              <Button variant="outline" className="flex-1" size="sm">
                Rent ${product.rentPrice}/day
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

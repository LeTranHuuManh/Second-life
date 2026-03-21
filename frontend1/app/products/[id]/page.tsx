'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { Star, Heart, Share2, TrendingUp, Clock, Shield, ChevronLeft } from 'lucide-react'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS.find(p => p.id === params.id)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const reviews = [
    { author: 'John D.', rating: 5, text: 'Excellent product! Exactly as described.' },
    { author: 'Sarah M.', rating: 4, text: 'Great quality, fast shipping.' },
    { author: 'Mike P.', rating: 5, text: 'Very satisfied with my purchase.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to products
        </Link>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-border p-8 flex items-center justify-center h-96 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Category Badge */}
            <div className="inline-flex w-fit">
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium mb-4">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} • {product.reviews} reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            {/* Seller Info */}
            <div className="bg-secondary/30 border border-secondary rounded-xl p-4 mb-6">
              <p className="text-xs text-muted-foreground uppercase mb-3">Sold by</p>
              <div className="flex items-center gap-3">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-foreground">{product.seller.name}</p>
                  <p className="text-sm text-muted-foreground">Professional Seller</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b border-border py-6 mb-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                <span className="text-lg text-muted-foreground line-through">$299</span>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  Save 50%
                </span>
              </div>
              {product.rentPrice && (
                <p className="text-muted-foreground text-sm">
                  or rent for <span className="font-semibold text-foreground">${product.rentPrice}/day</span>
                </p>
              )}
            </div>

            {/* Stock Info */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-foreground font-medium">{product.stock} in stock</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-l border-r border-border py-2 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg">
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-12"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="lg" className="w-12">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-muted-foreground">30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="border-b border-border pb-6 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{review.author}</p>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">You might also like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 3)
              .map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-secondary/10">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">${relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

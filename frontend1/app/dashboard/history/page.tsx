'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { Clock, Star } from 'lucide-react'

// Mock browsing history
const HISTORY = [
  { id: '1', productId: '1', viewedAt: '2 hours ago' },
  { id: '2', productId: '4', viewedAt: '5 hours ago' },
  { id: '3', productId: '2', viewedAt: '1 day ago' },
  { id: '4', productId: '5', viewedAt: '2 days ago' },
]

export default function HistoryPage() {
  const historyItems = HISTORY.map(item => ({
    ...item,
    product: MOCK_PRODUCTS.find(p => p.id === item.productId),
  })).filter(item => item.product)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex pt-16">
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Browsing History</h1>
                <p className="text-muted-foreground">
                  Products you've recently viewed
                </p>
              </div>
              <Button variant="outline">Clear History</Button>
            </div>

            {historyItems.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">No browsing history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyItems.map(item => (
                  <Link
                    key={item.id}
                    href={`/products/${item.product?.id}`}
                    className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all flex gap-4"
                  >
                    {/* Image */}
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    {/* Info */}
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product?.category}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(item.product?.rating || 0)
                                  ? 'fill-accent text-accent'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {item.product?.rating}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ${item.product?.price}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Viewed {item.viewedAt}
                        </p>
                        <Button size="sm" className="mt-3">
                          View Product
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

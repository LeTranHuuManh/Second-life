'use client'

import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { MOCK_RENTALS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { Calendar, Clock, CheckCircle, X } from 'lucide-react'

export default function RentalsPage() {
  const rentals = MOCK_RENTALS

  const getRentalStatus = (status: string) => {
    if (status === 'active') return { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Active' }
    if (status === 'completed') return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Completed' }
    return { icon: X, color: 'bg-red-100 text-red-700', label: 'Cancelled' }
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
              <h1 className="text-3xl font-bold text-foreground mb-2">My Rentals</h1>
              <p className="text-muted-foreground">
                View and manage your active and past rentals
              </p>
            </div>

            {/* Rentals List */}
            <div className="space-y-4">
              {rentals.map(rental => {
                const product = MOCK_PRODUCTS.find(p => p.id === rental.productId)
                const status = getRentalStatus(rental.status)
                const StatusIcon = status.icon

                return (
                  <div
                    key={rental.id}
                    className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Rental Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-border">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-foreground">
                            {product?.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Rental ID: {rental.id}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </div>

                    {/* Product and Dates */}
                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      {/* Product Info */}
                      <div className="flex gap-4">
                        <img
                          src={product?.image}
                          alt={product?.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Rental Period
                          </p>
                          <p className="font-semibold text-foreground">
                            {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {Math.ceil(
                              (new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                            )} days
                          </p>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="flex flex-col justify-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Daily Rate
                        </p>
                        <p className="font-semibold text-foreground text-lg mb-4">
                          ${product?.rentPrice}/day
                        </p>
                        <p className="text-lg font-bold text-primary">
                          Total: ${rental.totalPrice}
                        </p>
                      </div>
                    </div>

                    {/* Calendar View */}
                    <div className="bg-secondary/10 rounded-lg p-4 mb-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                        Rental Timeline
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          Start
                        </span>
                        <div className="flex-1 h-2 bg-blue-200 rounded-full"></div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          End
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {rental.status === 'active' && (
                        <>
                          <Button variant="outline" className="flex-1">
                            Extend Rental
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Return Early
                          </Button>
                        </>
                      )}
                      {rental.status === 'completed' && (
                        <Button className="flex-1">
                          Rent Again
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* No Rentals */}
            {rentals.length === 0 && (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">No active rentals</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

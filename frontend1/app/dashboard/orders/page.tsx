'use client'

import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { MOCK_ORDERS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { Package, Download, MessageSquare } from 'lucide-react'

export default function OrdersPage() {
  const orders = MOCK_ORDERS.slice(0, 5)

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
              <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
              <p className="text-muted-foreground">
                Track and manage your purchases
              </p>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map(order => {
                const products = order.items
                  .map(item => MOCK_PRODUCTS.find(p => p.id === item.productId))
                  .filter(Boolean)

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-border">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-foreground">Order {order.id}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ordered on {order.createdAt}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-4 py-2 rounded-lg font-medium text-sm ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'confirmed'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    {/* Products */}
                    <div className="mb-4 pb-4 border-b border-border">
                      {products.map(product => {
                        const item = order.items.find(i => i.productId === product?.id)
                        return (
                          <div key={product?.id} className="flex gap-4 mb-3 last:mb-0">
                            <img
                              src={product?.image}
                              alt={product?.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{product?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item?.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-foreground">
                              ${item?.price}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Order Total and Actions */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Estimated delivery: {order.estimatedDelivery}
                        </p>
                        <p className="font-semibold text-foreground text-lg">
                          Total: ${order.total}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Invoice</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="hidden sm:inline">Message</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS, MOCK_ORDERS } from '@/lib/mock-data'
import { BarChart3, ShoppingBag, TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role === 'guest') {
      router.push('/login')
    }
  }, [user, router])

  if (!user || user.role === 'guest') {
    return null
  }

  // Mock user stats
  const stats = [
    { icon: ShoppingBag, label: 'Total Products', value: '12', color: 'bg-blue-50 text-primary' },
    { icon: TrendingUp, label: 'Revenue', value: '$2,450', color: 'bg-green-50 text-green-600' },
    { icon: BarChart3, label: 'Views', value: '1,245', color: 'bg-purple-50 text-purple-600' },
    { icon: Clock, label: 'Active Rentals', value: '3', color: 'bg-orange-50 text-orange-600' },
  ]

  const recentOrders = MOCK_ORDERS.slice(0, 3)

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
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your account today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-border hover:bg-secondary/5">
                        <td className="py-4 px-4 font-medium text-foreground">{order.id}</td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">{order.createdAt}</td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">{order.items.length} items</td>
                        <td className="py-4 px-4 font-semibold text-foreground">${order.total}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

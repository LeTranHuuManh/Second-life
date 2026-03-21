'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS } from '@/lib/mock-data'
import {
  Users,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Search,
  Ban,
  Shield,
  Edit2,
  MoreVertical,
} from 'lucide-react'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'banned'>('all')

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  // Stats
  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: MOCK_USERS.length.toString(),
      color: 'bg-blue-50 text-primary',
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: MOCK_ORDERS.length.toString(),
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: TrendingUp,
      label: 'Products Listed',
      value: MOCK_PRODUCTS.length.toString(),
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: '$24.5K',
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  // Filter users
  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, monitor sales, and oversee platform activity
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

          {/* User Management */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">User Management</h2>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  {(['all', 'active', 'banned'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        selectedStatus === status
                          ? 'bg-primary text-white'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary/5">
                      <td className="py-4 px-4 font-medium text-foreground">{user.name}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{user.joinDate}</td>
                      <td className="py-4 px-4 font-semibold text-foreground">
                        ${user.totalSpent}
                      </td>
                      <td className="py-4 px-4">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <Ban className="w-3 h-3" />
                            Banned
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            {user.status === 'active' ? (
                              <Ban className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            ) : (
                              <Shield className="w-4 h-4 text-muted-foreground hover:text-green-600" />
                            )}
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Results */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

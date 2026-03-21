'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Bell, Check, Trash2 } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'order' | 'rental' | 'deal' | 'system'
  timestamp: string
  read: boolean
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Order Delivered',
    message: 'Your order #ORD-001 has been delivered successfully',
    type: 'order',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Rental Reminder',
    message: 'Your rental period for Mountain Bike ends in 3 days',
    type: 'rental',
    timestamp: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Special Deal Available',
    message: 'Save 30% on selected electronics this weekend only',
    type: 'deal',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '4',
    title: 'Account Security',
    message: 'Your account password was successfully changed',
    type: 'system',
    timestamp: '2 days ago',
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-700'
      case 'rental':
        return 'bg-purple-100 text-purple-700'
      case 'deal':
        return 'bg-green-100 text-green-700'
      case 'system':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex pt-16">
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
                <p className="text-muted-foreground">
                  {unreadCount} unread notifications
                </p>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-white rounded-xl border border-border p-12 text-center">
                  <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">No notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`rounded-xl border p-4 transition-all ${
                      notification.read
                        ? 'bg-white border-border'
                        : 'bg-secondary/20 border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Badge */}
                      <div
                        className={`mt-1 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {notification.type.charAt(0).toUpperCase() +
                          notification.type.slice(1)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            aria-label="Mark as read"
                          >
                            <Check className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          aria-label="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

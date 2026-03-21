'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react'

interface CartItem {
  productId: string
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: '1', quantity: 1 },
    { productId: '4', quantity: 2 },
  ])

  const products = cartItems
    .map(item => ({
      ...MOCK_PRODUCTS.find(p => p.id === item.productId)!,
      cartQuantity: item.quantity,
    }))
    .filter(p => p)

  const subtotal = products.reduce((sum, p) => sum + p.price * p.cartQuantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const removeItem = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      setCartItems(
        cartItems.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex pt-16">
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl">
            {/* Header */}
            <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
                <Link href="/">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {products.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-border p-4 sm:p-6 flex gap-4"
                    >
                      {/* Image */}
                      <Link href={`/products/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {product.seller.name}
                          </p>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() => updateQuantity(product.id, product.cartQuantity - 1)}
                              className="px-2 py-1 text-foreground hover:bg-secondary transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 font-medium">{product.cartQuantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, product.cartQuantity + 1)}
                              className="px-2 py-1 text-foreground hover:bg-secondary transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-semibold text-foreground">
                            ${(product.price * product.cartQuantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl border border-border p-6 h-fit sticky top-24">
                  <h2 className="text-lg font-bold text-foreground mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-foreground">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full gap-2">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full mt-3">
                    Continue Shopping
                  </Button>

                  {subtotal < 100 && (
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Free shipping on orders over $100!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Shipping' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Confirmation' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    // Payment
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleComplete = () => {
    router.push('/dashboard')
  }

  const isStepComplete = (stepId: number) => currentStep > stepId

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isStepComplete(step.id) || currentStep === step.id
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {isStepComplete(step.id) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Step Label */}
                <div className="ml-3">
                  <p className="text-xs text-muted-foreground">Step {step.id}</p>
                  <p className={`font-semibold ${
                    currentStep === step.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {step.label}
                  </p>
                </div>

                {/* Connector Line */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded ${
                      isStepComplete(step.id) ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8">
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="col-span-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                >
                  <option>Select Country</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary/5"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Order Review</h2>
              <div className="space-y-4">
                <div className="bg-secondary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Shipping To</p>
                  <p className="font-semibold text-foreground">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{formData.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.city}, {formData.postalCode}
                  </p>
                </div>

                <div className="bg-secondary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                  <p className="font-semibold text-foreground">
                    Card ending in {formData.cardNumber.slice(-4)}
                  </p>
                  <p className="text-sm text-muted-foreground">Expires {formData.expiry}</p>
                </div>

                <div className="bg-secondary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-3">Order Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>$330.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>$33.00</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">$363.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <div className="bg-secondary/10 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="font-semibold text-foreground">#ORD-2024-001234</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                You will receive a confirmation email at {formData.email}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex-1"
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="flex-1 gap-2"
            >
              Return to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

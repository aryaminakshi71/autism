import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background flex flex-col">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2 no-underline">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground">
                <span className="font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-foreground">Autism Care</span>
            </a>
            <a href="/" className="flex items text-muted-foreground hover:text-foreground no-underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </a>
          </div>
        </div>
      </nav>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-md">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-4">For individuals</p>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-muted-foreground">✓ Basic features</li>
                <li className="flex items-center text-muted-foreground">✓ Email support</li>
                <li className="flex items-center text-muted-foreground">✓ 1 user</li>
              </ul>
              <a href="/register" className="block w-full py-3 text-center rounded-lg font-semibold border border-border hover:bg-muted no-underline text-foreground">
                Get Started
              </a>
            </div>
            
            <div className="bg-card rounded-2xl p-8 border-2 border-primary shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-muted-foreground mb-4">For small teams</p>
              <div className="text-4xl font-bold mb-6">$79<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-muted-foreground">✓ All features</li>
                <li className="flex items-center text-muted-foreground">✓ Priority support</li>
                <li className="flex items-center text-muted-foreground">✓ 10 users</li>
                <li className="flex items-center text-muted-foreground">✓ API access</li>
              </ul>
              <a href="/register" className="block w-full py-3 text-center rounded-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 no-underline">
                Get Started
              </a>
            </div>
            
            <div className="bg-card rounded-2xl p-8 border border-border shadow-md">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-4">For large organizations</p>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-muted-foreground">✓ Unlimited users</li>
                <li className="flex items-center text-muted-foreground">✓ 24/7 support</li>
                <li className="flex items-center text-muted-foreground">✓ Custom integrations</li>
                <li className="flex items-center text-muted-foreground">✓ SLA</li>
              </ul>
              <a href="/contact" className="block w-full py-3 text-center rounded-lg font-semibold border border-border hover:bg-muted no-underline text-foreground">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { ArrowLeft } from 'lucide-react'

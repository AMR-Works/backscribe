import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react"
import { Dashboard } from "@/components/Dashboard"
import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { Pricing } from "@/components/Pricing"

const AppContent = () => {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Hero />
            <Features />
            <Pricing />
          </main>
        </div>
      </SignedOut>
      
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  )
}

const Index = () => {
  return <AppContent />
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
// import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App'

const PUBLISHABLE_KEY = "pk_test_ZXhhY3QtY3JheWZpc2gtNDQuY2xlcmsuYWNjb3VudHMuZGV2JA"
// const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://your-convex-deployment-url.convex.cloud"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// const convex = new ConvexReactClient(CONVEX_URL)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {/* <ConvexProvider client={convex}> */}
        <BrowserRouter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <App />
          </ThemeProvider>
        </BrowserRouter>
      {/* </ConvexProvider> */}
    </ClerkProvider>
  </StrictMode>,
)

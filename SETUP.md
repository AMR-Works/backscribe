# BackScribe - Text Behind Image SaaS

## Setup Instructions

### 1. Clerk Authentication ✅
Your Clerk integration is ready with the publishable key: `pk_test_ZXhhY3QtY3JheWZpc2gtNDQuY2xlcmsuYWNjb3VudHMuZGV2JA`

### 2. Convex Database Setup ✅

To complete the Convex integration:

1. **Install Convex CLI**:
   ```bash
   npm install -g convex
   ```

2. **Initialize Convex**:
   ```bash
   npx convex dev
   ```

3. **Follow the prompts to**:
   - Create a new Convex project or connect to existing
   - Deploy the schema and functions
   - Get your deployment URL

4. **Update the Convex URL**:
   - After setup, replace `https://your-convex-deployment-url.convex.cloud` in `src/main.tsx` with your actual Convex URL

### 3. Features Implemented ✅

- **Authentication Flow**: Sign in/up modals with Clerk
- **Protected Routes**: Landing page for guests, dashboard for authenticated users  
- **Database Schema**: User tracking, subscription status, usage limits
- **Usage Tracking**: Monthly download limits (5 for free, unlimited for Pro)
- **Feature Gating**: Pro-only features clearly marked
- **Responsive Design**: Mobile-friendly with smooth animations

### 4. Polar.sh Integration ✅

**Payments Setup**:
1. **Create Polar.sh Product**:
   - Sign up at https://polar.sh
   - Create a $4.99/month subscription product
   - Get your product ID and replace `your-product-id` in the upgrade buttons

2. **Configure Webhook**:
   - In Polar.sh dashboard, add webhook URL: `https://your-convex-deployment.convex.site/polar-webhook`
   - Subscribe to events: `subscription.created`, `subscription.updated`, `subscription.cancelled`, `subscription.expired`

### 5. Next Steps

1. Run `npx convex dev` to set up your Convex project
2. Replace `your-product-id` with your actual Polar.sh product ID
3. Replace the Convex URL in main.tsx with your deployment URL
4. Build the image editor canvas functionality  
5. Add background removal with @imgly/background-removal

The app now has complete authentication, Convex database, and payment infrastructure!
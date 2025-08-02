# BackScribe - Text Behind Image SaaS

## Setup Instructions

### 1. Clerk Authentication ✅
Your Clerk integration is ready with the publishable key: `pk_test_ZXhhY3QtY3JheWZpc2gtNDQuY2xlcmsuYWNjb3VudHMuZGV2JA`

### 2. Convex Database Setup 🔧

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
   - Create a new Convex project
   - Connect to your account
   - Deploy the schema and functions

4. **Update the Convex URL**:
   - After setup, replace the placeholder URL in `src/main.tsx` with your actual Convex URL

### 3. Features Implemented ✅

- **Authentication Flow**: Sign in/up modals with Clerk
- **Protected Routes**: Landing page for guests, dashboard for authenticated users  
- **Database Schema**: User tracking, subscription status, usage limits
- **Usage Tracking**: Monthly download limits (5 for free, unlimited for Pro)
- **Feature Gating**: Pro-only features clearly marked
- **Responsive Design**: Mobile-friendly with smooth animations

### 4. Next Steps

1. Set up your Convex project following the instructions above
2. Integrate Polar.sh for payments (webhook to update subscription status)
3. Build the image editor canvas functionality
4. Add background removal with @imgly/background-removal

The app now has a complete authentication and database foundation ready for the core image editing features!
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Polar webhook received:', body)

    // Verify webhook signature (optional but recommended)
    const signature = req.headers.get('x-polar-signature')
    const webhookSecret = Deno.env.get('POLAR_WEBHOOK_SECRET')
    
    if (webhookSecret && signature) {
      // Add signature verification logic here if needed
      console.log('Webhook signature verification needed')
    }

    // Handle subscription created/updated events
    if (body.type === 'subscription.created' || body.type === 'subscription.updated') {
      const subscription = body.data
      const customerEmail = subscription.customer?.email
      
      if (customerEmail && subscription.status === 'active') {
        // Update user's subscription status in your database
        // You'll need to implement your own user lookup logic here
        
        // For now, we'll create a simple users table entry
        const { data, error } = await supabase
          .from('users')
          .upsert({
            email: customerEmail,
            paid: true,
            subscription_id: subscription.id,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'email'
          })

        if (error) {
          console.error('Error updating user subscription:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to update subscription' }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        console.log('Successfully updated user subscription for:', customerEmail)
      }
    }

    // Handle subscription cancelled/expired events
    if (body.type === 'subscription.cancelled' || body.type === 'subscription.expired') {
      const subscription = body.data
      const customerEmail = subscription.customer?.email
      
      if (customerEmail) {
        const { error } = await supabase
          .from('users')
          .update({
            paid: false,
            subscription_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('email', customerEmail)

        if (error) {
          console.error('Error cancelling user subscription:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to cancel subscription' }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        console.log('Successfully cancelled subscription for:', customerEmail)
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
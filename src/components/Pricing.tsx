import { motion } from "framer-motion"
import { SignUpButton } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Download, Palette, RotateCcw, Type, Zap } from "lucide-react"

const features = {
  free: [
    { icon: Download, text: "5 downloads per month" },
    { icon: Type, text: "6 beautiful fonts" },
    { icon: Palette, text: "Full color customization" },
    { icon: Zap, text: "Basic text shadows" },
  ],
  pro: [
    { icon: Download, text: "Unlimited downloads" },
    { icon: Type, text: "All Google Fonts" },
    { icon: RotateCcw, text: "3D tilt & rotation" },
    { icon: Palette, text: "Advanced text effects" },
    { icon: Crown, text: "Priority support" },
  ]
}

export function Pricing() {
  return (
    <section className="py-24 bg-gradient-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="gradient-text">Creative Power</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready for unlimited creativity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="relative h-full shadow-soft">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <CardDescription className="text-base">
                  Perfect for getting started
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.free.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <SignUpButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="relative h-full shadow-glow border-primary/20">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <CardDescription className="text-base">
                  Unlimited creative freedom
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold gradient-text">$4.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.pro.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button variant="premium" className="w-full">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            All plans include unlimited image uploads and our core text-behind-image features
          </p>
        </motion.div>
      </div>
    </section>
  )
}
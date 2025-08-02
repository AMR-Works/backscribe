import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Shield, 
  Palette, 
  Download, 
  RotateCcw, 
  Type,
  Layers,
  Sparkles,
  Clock,
  Globe
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "100% client-side rendering means instant previews and zero server delays",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your images never leave your device. Complete privacy and security.",
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    icon: Palette,
    title: "Rich Customization",
    description: "Colors, shadows, fonts, positioning - total creative control at your fingertips",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: RotateCcw,
    title: "3D Effects",
    description: "Professional tilt and rotation effects to make your text pop off the screen",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    pro: true
  },
  {
    icon: Type,
    title: "Google Fonts",
    description: "Access to entire Google Fonts library for unlimited typography options",
    color: "text-red-500",
    bg: "bg-red-500/10",
    pro: true
  },
  {
    icon: Layers,
    title: "Multi-Layer Text",
    description: "Add multiple text layers with different styles and positioning",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    icon: Download,
    title: "High-Quality Export",
    description: "Download your creations in high resolution, perfect for any use case",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "No downloads, no installations. Works in any modern web browser",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    icon: Clock,
    title: "Real-Time Preview",
    description: "See your changes instantly as you type and adjust settings",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Create Magic</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade text effects, lightning-fast performance, and complete privacy
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-soft hover:shadow-elegant transition-shadow group relative overflow-hidden">
                {feature.pro && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      Pro
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-hero border-primary/20 shadow-glow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">AI Background Removal</span>
              </div>
              <p className="text-muted-foreground">
                Powered by cutting-edge WebAssembly technology, remove backgrounds from your images 
                instantly without any server uploads. Your creativity, enhanced by AI.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
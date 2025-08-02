import { motion } from "framer-motion"
import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/clerk-react"
import { useUserData } from "@/hooks/use-convex"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Download, 
  Palette, 
  Type, 
  RotateCcw, 
  Crown,
  Sparkles,
  Zap
} from "lucide-react"

export function Dashboard() {
  const { userData, isLoading } = useUserData()
  
  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    )
  }
  
  const userStats = {
    imagesGenerated: userData.imagesGenerated,
    maxImages: userData.paid ? -1 : 5,
    isPro: userData.paid,
    subscriptionStatus: userData.paid ? 'pro' : 'free'
  }

  const progressPercentage = userStats.isPro ? 100 : (userStats.imagesGenerated / userStats.maxImages) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">BackScribe</h1>
                <p className="text-xs text-muted-foreground">Create. Design. Download.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {!userStats.isPro && (
                <Button variant="premium" size="sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Usage Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Usage Stats</CardTitle>
                <CardDescription>
                  {userStats.isPro ? 'Unlimited downloads' : 'Free tier limits'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!userStats.isPro && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Downloads</span>
                      <span className="text-sm text-muted-foreground">
                        {userStats.imagesGenerated}/{userStats.maxImages}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Resets monthly
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Background removal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Real-time preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${userStats.isPro ? 'bg-primary' : 'bg-muted'}`} />
                    <span className={`text-sm ${!userStats.isPro && 'text-muted-foreground'}`}>
                      Advanced effects {!userStats.isPro && '(Pro)'}
                    </span>
                  </div>
                </div>

                {!userStats.isPro && (
                  <Button variant="premium" className="w-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade for $4.99/mo
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Text Behind Image Editor
                </CardTitle>
                <CardDescription>
                  Upload an image and add stunning text effects behind it
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Area */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 group-hover:text-primary transition-colors" />
                  <h3 className="text-lg font-semibold mb-2">Upload Your Image</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop or click to select an image
                  </p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                </motion.div>

                {/* Tools Preview */}
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <Type className="w-8 h-8 text-primary mb-2" />
                      <h4 className="font-semibold mb-1">Typography</h4>
                      <p className="text-sm text-muted-foreground">
                        {userStats.isPro ? 'All Google Fonts' : '6 Beautiful Fonts'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <Palette className="w-8 h-8 text-primary mb-2" />
                      <h4 className="font-semibold mb-1">Colors & Effects</h4>
                      <p className="text-sm text-muted-foreground">
                        Full color control + shadows
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${userStats.isPro ? 'bg-muted/30' : 'bg-muted/10 border-dashed'}`}>
                    <CardContent className="pt-4">
                      <RotateCcw className={`w-8 h-8 mb-2 ${userStats.isPro ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${!userStats.isPro && 'text-muted-foreground'}`}>
                          3D Effects
                        </h4>
                        {!userStats.isPro && (
                          <Badge variant="secondary" className="text-xs">Pro</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tilt & rotation effects
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
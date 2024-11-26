import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="parliament.jpg"
            alt="Pakistan Parliament"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6 text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Meet Numainda
          </h1>
          <p className="text-xl text-white/80">
            Your Digital Gateway to Pakistan&apos;s Constitution and Legislative Knowledge
          </p>
        </div>
      </div>

      {/* Journey Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>The Original Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Numainda began as a parliamentary monitoring system, tracking attendance, 
              voting patterns, and legislative performance metrics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>The Pivot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              User research revealed a deeper need: making constitutional knowledge 
              accessible. We transformed into an AI-powered constitutional guide.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Numainda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Now an interactive platform where citizens learn about their constitution 
              and rights through natural conversations in simple language.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Article */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Our Story in the Media</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6 items-center">
          <img 
            src="https://codeforpakistan.org/sites/default/files/cfp_logotype_h.png" 
            alt="Code for Pakistan Logo" 
            className="w-24 h-24 object-contain"
          />
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Say Hello to My New Friend</h3>
            <p className="text-muted-foreground">
              Read about how Numainda is transforming constitutional literacy in Pakistan 
              through the power of AI and human-centered design.
            </p>
            <Button variant="outline" asChild>
              <a 
                href="https://codeforpakistan.org/stories/say-hello-to-my-new-friend"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Read on Code for Pakistan
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">24/7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Constitutional guidance available round the clock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Simple Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Complex legal concepts explained in everyday terms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Bilingual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Support in both English and Urdu
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

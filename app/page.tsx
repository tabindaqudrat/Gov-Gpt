import Link from "next/link"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Voicemail, LandmarkIcon, MessageSquare, Info } from 'lucide-react'

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Welcome to Numainda <br className="hidden sm:inline" />
          Your Legal Knowledge Companion
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Explore Pakistan's rich legal and parliamentary heritage with our AI-powered chatbot. 
          Gain insights into the constitution, election laws, and parliamentary bulletins.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/chat"
          className={buttonVariants({ variant: "default" })}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Start Chatting
        </Link>
        <Link
          href="/about"
          className={buttonVariants({ variant: "outline" })}
        >
          <Info className="mr-2 h-4 w-4" />
          Learn More
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="mr-2 h-5 w-5" />
              Explore the Constitution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dive into the heart of Pakistan's legal framework. Understand the amendments and their impact on our society.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Voicemail className="mr-2 h-5 w-5" />
              Election Laws Demystified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Get clarity on election processes, voter rights, and the mechanisms that drive our democracy.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LandmarkIcon className="mr-2 h-5 w-5" />
              Parliamentary Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Stay updated with the latest parliamentary bulletins and understand how laws are made and amended.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Info className="mr-2 h-6 w-6" />
          Why We Built Numainda
        </h2>
        <p className="text-muted-foreground">
          Inspired by generations of constitutional presence and the need for accessible legal knowledge, 
          Numainda bridges the gap between citizens and the laws that govern them. We believe that an 
          informed citizenry is the cornerstone of a thriving democracy.
        </p>
      </div>
    </section>
  )
}


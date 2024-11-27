import Link from "next/link"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, LucideBook, LandmarkIcon, MessageSquare, Info, ScaleIcon } from 'lucide-react'

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="relative h-[400px] sm:h-[300px] rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img
            src="SC-b6-1.jpg"
            alt="Supreme Court of Pakistan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
        </div>
        <div className="relative z-10 h-full flex max-w-[980px] flex-col justify-center p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Welcome to Numainda <br className="hidden sm:inline" />
            Your Guide to Pakistan&apos;s Constitution and Laws
          </h1>
          <p className="max-w-[700px] text-base sm:text-lg text-muted-foreground mt-4">
            Explore Pakistan&apos;s rich legal and parliamentary heritage with our AI-powered chatbot. 
            Gain insights into the constitution, election laws, and parliamentary bulletins.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/chat"
          className={buttonVariants({ 
            variant: "default",
            size: "lg",
            className: "w-full sm:w-auto"
          })}
        >
          <MessageSquare className="mr-2 h-6 w-6" />
          Start Chatting
        </Link>
        <Link
          href="/about"
          className={buttonVariants({ 
            variant: "outline",
            size: "lg",
            className: "w-full sm:w-auto"
          })}
        >
          <Info className="mr-2 h-6 w-6" />
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
            <p>Dive into the heart of Pakistan&apos;s legal framework. Understand the amendments and their impact on our society.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ScaleIcon className="mr-2 h-5 w-5" />
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


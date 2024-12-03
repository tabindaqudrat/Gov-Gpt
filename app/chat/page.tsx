"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "ai/react"
import {
  Bot,
  CopyIcon,
  Menu,
  MessageSquare,
  RefreshCcw,
  SendIcon,
  User,
  LogOut,
} from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble"
import { ChatInput } from "@/components/ui/chat/chat-input"
import { MessageThreadsSidebar } from "@/app/components/message-threads-sidebar"
import { PehchanLoginButton } from "@/components/pehchan-button"

const ChatAiIcons = [
  { icon: CopyIcon, label: "Copy" },
  { icon: RefreshCcw, label: "Refresh" },
]

export default function ChatPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [threadId, setThreadId] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    console.log('Auth check - access_token:', accessToken)
    setIsAuthenticated(!!accessToken)
  }, [])

  useEffect(() => {
    const loadOrCreateThread = async () => {
      console.log('loadOrCreateThread called, isAuthenticated:', isAuthenticated)
      if (!isAuthenticated) return
      
      const pehchanId = localStorage.getItem('pehchan_id')
      console.log('Pehchan ID:', pehchanId)
      if (!pehchanId) return

      const threadIdParam = searchParams.get('thread')
      if (threadIdParam) {
        console.log('Loading thread:', threadIdParam)
        const response = await fetch(`/api/chat/threads/${threadIdParam}?pehchan_id=${pehchanId}`)
        const thread = await response.json()
        console.log('Loaded thread:', thread)

        if (thread) {
          setThreadId(thread.id)
          setMessages(thread.messages)
        }
      } else {
        console.log('Creating new thread')
        const response = await fetch('/api/chat/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            pehchanId,
            title: 'New Chat'
          })
        })
        const thread = await response.json()
        console.log('Created thread:', thread)

        if (thread) {
          setThreadId(thread.id)
          router.push(`/chat?thread=${thread.id}`)
        }
      }
    }

    loadOrCreateThread()
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.clear()
    window.dispatchEvent(new Event('localStorageChange'))
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    })
    router.refresh()
  }

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I am Numainda, your guide to Pakistan's constitutional and electoral information. How may I assist you today?",
      },
    ],
    onResponse: (response) => {
      if (response) {
        setIsGenerating(false)
        // Update thread via API
        if (threadId) {
          fetch(`/api/chat/threads/${threadId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages,
              title: messages[1]?.content.slice(0, 100) || 'New Chat',
              pehchanId: localStorage.getItem('pehchan_id')
            })
          })
        }
      }
    },
    onError: (error) => {
      if (error) setIsGenerating(false)
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden touch-manipulation">
      <MessageThreadsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background h-14 border-b flex items-center justify-between px-4 flex-none">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <MessageSquare className="h-5 w-5 mr-2" />
            <span className="font-semibold">Numainda Chat</span>
          </div>
          
          {/* {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )} */}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col max-w-2xl mx-auto p-4">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.role === "user" ? "sent" : "received"}
                className="mb-6"
              >
                <ChatBubbleAvatar
                  className={
                    message.role === "assistant"
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted"
                  }
                  fallback={
                    message.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )
                  }
                />
                <ChatBubbleMessage>
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown>
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="flex-none p-4">
          <div className="max-w-2xl mx-auto">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!input?.trim() || isLoading) return
                setIsGenerating(true)
                handleSubmit(e)
              }}
            >
              <ChatInput
                value={input}
                onChange={handleInputChange}
                placeholder="Message Numainda..."
                className="w-full rounded-lg border px-3 py-2 text-base bg-slate-500/10"
                style={{ fontSize: "16px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (!input?.trim() || isLoading) return
                    setIsGenerating(true)
                    handleSubmit(e)
                  }
                }}
              />
              <Button size="icon">
                <SendIcon />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

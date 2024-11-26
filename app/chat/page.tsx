"use client";

import { useChat } from "ai/react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/message";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I am Numainda, your guide to Pakistan's constitutional and electoral information. How may I assist you today?",
      },
    ],
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestedQuestions = [
    "What are the qualifications for becoming a member of parliament?",
    "How does the election commission handle vote counting?",
    "What are the key amendments in Pakistan's constitution?",
    "Explain the process of filing election nominations",
    "What happened in the last parliamentary session?",
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Numainda Chat</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container flex-1 space-y-4 py-6">
        <div className="grid h-full gap-6 md:grid-cols-[1fr_280px]">
          {/* Chat Section */}
          <div className="flex flex-col space-y-4">
            <Card className="flex-1 overflow-hidden">
              <div
                ref={scrollRef}
                className="h-[calc(100vh-16rem)] overflow-auto p-4 scroll-smooth"
              >
                <div className="space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      role={message.role === "data" ? "assistant" : message.role}
                      content={message.content}
                    />
                  ))}
                  {isLoading && (
                    <ChatMessage
                      role="assistant"
                      content=""
                      isLoading
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* Input Section */}
            <Card className="border-2">
              <div className="p-2">
                <ChatInput
                  input={input}
                  setInput={(value: string) => handleInputChange({ target: { value } } as any)}
                  onSubmit={async (value) => {
                    await handleSubmit({ preventDefault: () => {} } as any);
                  }}
                  isLoading={isLoading}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="hidden space-y-4 md:block">
            <Card>
              <div className="p-4">
                <h2 className="font-semibold">About Numainda</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  I am an AI assistant specialized in Pakistan's constitutional and electoral information. 
                  I can help you understand laws, parliamentary proceedings, and election processes.
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <h2 className="font-semibold">Suggested Questions</h2>
                <div className="mt-2 space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
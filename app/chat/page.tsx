"use client";

import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  CopyIcon,
  RefreshCcw,
  Volume2,
  Paperclip,
  Mic,
  CornerDownLeft,
  Bot,
  User
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatInput } from "@/components/ui/chat/chat-input";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatAiIcons = [
  { icon: CopyIcon, label: "Copy" },
  { icon: RefreshCcw, label: "Refresh" },
  // { icon: Volume2, label: "Volume" },
];

export default function ChatPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I am Numainda, your guide to Pakistan's constitutional and electoral information. How may I assist you today?",
      },
    ],
    onResponse(response) {
      if (response) {
        setIsGenerating(false);
      }
    },
    onError(error) {
      if (error) {
        setIsGenerating(false);
      }
    },
  });

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input?.trim()) return;
    setIsGenerating(true);
    await handleSubmit(e);
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    if (action === "Refresh") {
      setIsGenerating(true);
      try {
        await reload();
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === "Copy") {
      const message = messages[messageIndex];
      if (message?.role === "assistant") {
        navigator.clipboard.writeText(message.content);
      }
    }
  };

  const suggestedQuestions = [
    "What are the qualifications for becoming a member of parliament?",
    "How does the election commission handle vote counting?",
    "What are the key amendments in Pakistan's constitution?",
    "Explain the process of filing election nominations",
    "What happened in the last parliamentary session?",
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Numainda Chat</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container flex-1 py-2 sm:py-4 overflow-hidden">
        <div className="grid h-full gap-4 lg:grid-cols-[1fr_300px]">
          {/* Chat Section */}
          <div className="flex flex-col space-y-4 h-full">
            <Card className="flex-1 overflow-hidden">
              <ChatMessageList 
                ref={messagesRef}
                className="h-[calc(100vh-11rem)] sm:h-[calc(100vh-13rem)] overflow-y-auto"
              >
                {messages.map((message, index) => (
                  <ChatBubble
                    key={message.id}
                    variant={message.role === "user" ? "sent" : "received"}
                    layout={message.role === "assistant" ? "ai" : undefined}
                  >
                    <ChatBubbleAvatar
                      className={cn(
                        "flex items-center justify-center",
                        message.role === "assistant" 
                          ? "bg-primary/10 border border-primary/20 text-primary"
                          : "bg-muted/50 border border-muted text-muted-foreground"
                      )}
                      fallback={
                        message.role === "assistant" 
                          ? <Bot className="h-4 w-4" />
                          : <User className="h-4 w-4" />
                      }
                    />
                    <ChatBubbleMessage>
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </Markdown>
                      {message.role === "assistant" && messages.length - 1 === index && (
                        <div className="flex items-center mt-1.5 gap-1">
                          {!isGenerating && (
                            <>
                              {ChatAiIcons.map((icon, iconIndex) => {
                                const Icon = icon.icon;
                                return (
                                  <ChatBubbleAction
                                    key={iconIndex}
                                    variant="outline"
                                    className="size-5"
                                    icon={<Icon className="size-3" />}
                                    onClick={() => handleActionClick(icon.label, index)}
                                  />
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}
                {isGenerating && (
                  <ChatBubble variant="received" layout="ai">
                    <ChatBubbleAvatar src="/ai-avatar.png" fallback="AI" />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}
              </ChatMessageList>
            </Card>

            {/* Input Section */}
            <div className="relative">
              <form
                ref={formRef}
                onSubmit={onSubmit}
                className="relative flex flex-col rounded-xl border bg-background"
              >
                <ChatInput
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about Pakistan&apos;s constitution, election laws, or parliamentary proceedings..."
                  className="min-h-12 resize-none rounded-xl bg-transparent border-0 p-2 sm:p-3 shadow-none focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      formRef.current?.requestSubmit();
                    }
                  }}
                />
                <div className="flex items-center px-2 sm:px-3 pb-2 sm:pb-3">
                  <Button
                    disabled={!input || isLoading}
                    type="submit"
                    size="sm"
                    className="ml-auto gap-1.5"
                  >
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:flex flex-col space-y-4 h-full overflow-y-auto">
            <Card className="p-4">
              <h2 className="font-semibold mb-2">About Numainda</h2>
              <p className="text-sm text-muted-foreground">
                I am an AI assistant specialized in Pakistan's constitutional and electoral information. 
                I can help you understand laws, parliamentary proceedings, and election processes.
              </p>
            </Card>
            <Card className="p-4 flex-1">
              <h2 className="font-semibold mb-3">Suggested Questions</h2>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto whitespace-normal text-left"
                    onClick={() => {
                      handleInputChange({ target: { value: question } } as any);
                      handleSubmit({ preventDefault: () => {} } as any);
                    }}
                    disabled={isLoading}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

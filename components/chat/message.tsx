import { cn } from "@/lib/utils";
import { Bot, User } from 'lucide-react';
import ReactMarkdown from "react-markdown";

export interface ChatMessageProps {
  role: "system" | "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg p-4",
        role === "user" ? "bg-muted/50" : "bg-background border"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
        role === "assistant" ? "bg-primary/10" : "bg-background"
      )}>
        {role === "user" ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden break-words">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300" />
          </div>
        ) : (
          <ReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}


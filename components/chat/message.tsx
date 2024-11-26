import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
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
        "flex w-full items-start gap-4 rounded-lg p-4",
        role === "user" ? "bg-muted/50" : "bg-background"
      )}
    >
      <div className={cn(
        "flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
        role === "assistant" && "bg-primary/10"
      )}>
        {role === "user" ? (
          <Icons.sun className="size-4" />
        ) : (
          <Icons.moon className="size-4" /> 
        )}
      </div>
      <div className="flex-1 space-y-2">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="size-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.3s]" />
            <div className="size-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.15s]" />
            <div className="size-2 animate-bounce rounded-full bg-zinc-300" />
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
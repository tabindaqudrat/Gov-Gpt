import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { PehchanLoginButton } from "@/components/pehchan-button";
import { useRouter } from 'next/navigation'

interface MessageThreadsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatThread {
  id: string
  title: string
  created_at: string
  messages: any[]
}

export function MessageThreadsSidebar({ isOpen, onClose }: MessageThreadsSidebarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check initial auth state
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      console.log('Sidebar auth check - access_token:', accessToken)
      setIsAuthenticated(!!accessToken);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates
    const handleCustomStorageChange = () => checkAuth();
    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  useEffect(() => {
    const loadThreads = async () => {
      console.log('loadThreads called, isAuthenticated:', isAuthenticated)
      const pehchanId = localStorage.getItem('pehchan_id')
      console.log('Sidebar - Pehchan ID:', pehchanId)
      if (!pehchanId) return

      const response = await fetch(`/api/chat/threads?pehchan_id=${pehchanId}`)
      const threads = await response.json()
      setThreads(threads)
    }

    if (isAuthenticated) {
      loadThreads()
      // Set up polling for updates
      const interval = setInterval(loadThreads, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-background border-r",
          "transform transition-transform duration-200 ease-in-out lg:transform-none",
          "lg:relative lg:block",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="h-14 border-b flex items-center justify-between px-4">
            <span className="font-semibold">Chats</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isAuthenticated ? (
            <>
              <div className="flex-1 overflow-y-auto p-2">
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  onClick={() => router.push('/chat')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                
                {threads.map((thread) => (
                  <Button
                    key={thread.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3 px-3 mb-1"
                    onClick={() => {
                      router.push(`/chat?thread=${thread.id}`)
                      onClose?.()
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-3 shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{thread.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {thread.messages[thread.messages.length - 1]?.content.slice(0, 50) || 'New chat'}...
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="p-4 border-t">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <PehchanLoginButton />
            </div>
          )}
        </div>
      </aside>
    </>
  );
} 
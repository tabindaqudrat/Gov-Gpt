import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MessageThreadsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessageThreadsSidebar({ isOpen, onClose }: MessageThreadsSidebarProps) {
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
          
          <div className="flex-1 overflow-y-auto p-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-3 mb-1"
            >
              <MessageCircle className="h-4 w-4 mr-3 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <div className="font-medium truncate">Constitutional Amendments</div>
                <div className="text-xs text-muted-foreground truncate">
                  What are the key amendments...
                </div>
              </div>
            </Button>
          </div>

          <div className="p-4 border-t">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
} 
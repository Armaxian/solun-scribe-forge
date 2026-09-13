import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CopyableHashProps {
  hash: string;
  label?: string;
  className?: string;
  variant?: "default" | "compact";
}

/**
 * CopyableHash component - displays a SHA256 hash with copy functionality
 * 
 * Features:
 * - Click to copy hash to clipboard
 * - Visual feedback (check icon on success)
 * - Toast notification on copy
 * - Accessible button with proper ARIA labels
 */
export function CopyableHash({
  hash,
  label,
  className,
  variant = "default",
}: CopyableHashProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      toast({
        title: "Hash copied!",
        description: "SHA256 hash copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the hash manually",
        variant: "destructive",
      });
    }
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <code className="text-xs font-mono bg-muted px-2 py-1 rounded border flex-1 break-all">
          {hash}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleCopy}
          aria-label="Copy hash to clipboard"
          title="Copy hash"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="text-sm font-medium text-foreground">{label}</div>
      )}
      <div className="flex items-center gap-2 p-3 rounded-lg border bg-background">
        <code className="text-sm font-mono text-foreground break-all flex-1">
          {hash}
        </code>
        <Button
          variant="outline"
          size="default"
          className="shrink-0"
          onClick={handleCopy}
          aria-label="Copy SHA256 hash to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { enhanceSentiment } from '@/ai/flows/ai-sentiment-enrichment';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type SentimentEnhancerProps = {
  message: string;
  onEnhance: (enhancedMessage: string) => void;
};

export function SentimentEnhancer({ message, onEnhance }: SentimentEnhancerProps) {
  const [isPending, startTransition] = useTransition();
  const [enhancedMessage, setEnhancedMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEnhanceClick = () => {
    setEnhancedMessage('');
    setIsDialogOpen(true);
    startTransition(async () => {
      try {
        const result = await enhanceSentiment({ message });
        setEnhancedMessage(result.enhancedMessage);
      } catch (error) {
        console.error("AI enhancement failed:", error);
        toast({
          variant: "destructive",
          title: "Enhancement Failed",
          description: "Could not enhance the message. Please try again later.",
        });
        setIsDialogOpen(false);
      }
    });
  };

  const handleAccept = () => {
    onEnhance(enhancedMessage);
    setIsDialogOpen(false);
  };
  
  const handleClose = () => {
    if (isPending) return;
    setIsDialogOpen(false);
  }

  return (
    <>
      <Button onClick={handleEnhanceClick} disabled={isPending || !message.trim()} variant="outline" size="sm" className="bg-accent/10 border-accent/50 text-accent-foreground hover:bg-accent/20">
        <Wand2 className="mr-2 h-4 w-4" />
        Enhance with AI
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">AI-Enhanced Greeting</DialogTitle>
            <DialogDescription>
              Here's a suggestion to make your message even more special.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 min-h-[100px]">
            {isPending ? (
              <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap">{enhancedMessage}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAccept} disabled={isPending}>Accept Suggestion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

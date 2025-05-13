import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

// Interface for Claude response
interface ClaudeResponse {
  answer: string;
  intent: {
    type: 'transfer' | 'moveCall' | 'nftMint' | 'query' | 'unknown';
    params: Record<string, any>;
  };
}

export function useClaude() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check if Claude API is available
  const checkAvailability = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<{available: boolean; message: string}>('services/claude');
      setIsAvailable(data.available);
      return data.available;
    } catch (error) {
      console.error('Error checking Claude availability:', error);
      setIsAvailable(false);
      toast({
        title: 'API Error',
        description: 'Unable to check LLM service availability',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Ask Claude a question
  const askQuestion = useCallback(async (
    question: string
  ): Promise<ClaudeResponse | null> => {
    if (!question.trim()) return null;

    try {
      setIsLoading(true);
      
      // Call the server API
      const data = await api.post<ClaudeResponse>('services/claude/ask', {
        message: question
      });
      
      return data;
    } catch (error) {
      console.error('Error asking Claude:', error);
      toast({
        title: 'Conversation Error',
        description: error instanceof Error ? error.message : 'Failed to process your message',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    askQuestion,
    checkAvailability,
    isLoading,
    isAvailable,
  };
}

export default useClaude;
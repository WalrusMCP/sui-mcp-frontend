import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RefreshCw, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useTransactions } from "@/hooks/use-transactions";
import { useToast } from "@/hooks/use-toast";
import { useClaude } from "@/hooks/use-claude";

// Message types
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m your Sui blockchain assistant. I can help you build transactions, query crypto prices, or answer questions about blockchain. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mcpClient, connected, connect } = useWallet();
  const { buildTransaction, executeTransaction } = useTransactions(mcpClient, 1);
  const { toast } = useToast();
  const { askQuestion, isLoading, checkAvailability } = useClaude();

  // Check if Claude API is available on component mount
  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {

    console.log("23456789o8765r4e32345678=========")

    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      // Use our Claude hook to process the message
      const response = await askQuestion(input);

      if (response) {
        // Add assistant response to chat
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        
        // Check if the message contains a transaction intent
        if (response.intent && response.intent.type !== 'unknown') {
          handleTransactionIntent(response.intent);
        }
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'system',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to process your message',
        variant: 'destructive'
      });
    }
  };

  // Handle transaction intents detected by the AI
  const handleTransactionIntent = async (intent: { type: string; params: Record<string, any> }) => {
    if (!connected) {
      const connectMessage: Message = {
        id: generateId(),
        role: 'system',
        content: 'It looks like you want to perform a transaction. Please connect your wallet first.',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, connectMessage]);
      return;
    }
    
    try {
      let transaction;
      
      switch (intent.type) {
        case 'transfer':
          if (!intent.params.recipient || !intent.params.amount) {
            const missingParamsMessage: Message = {
              id: generateId(),
              role: 'system',
              content: `To make a transfer, I need both a recipient address and an amount. ${
                !intent.params.recipient ? 'Please provide a recipient address. ' : ''
              }${
                !intent.params.amount ? 'Please specify an amount to transfer.' : ''
              }`,
              timestamp: new Date()
            };
            setMessages(prevMessages => [...prevMessages, missingParamsMessage]);
            return;
          }
          
          // Build transfer transaction with proper type casting
          transaction = await buildTransaction('transfer', {
            recipient: intent.params.recipient,
            amount: intent.params.amount,
            objectId: intent.params.objectId
          });
          break;
          
        case 'moveCall':
          // Build Move call transaction with proper type casting
          transaction = await buildTransaction('moveCall', {
            packageObjectId: intent.params.packageId || '',
            module: intent.params.module || '',
            function: intent.params.function || '',
            typeArguments: Array.isArray(intent.params.typeArguments) ? intent.params.typeArguments : [],
            arguments: Array.isArray(intent.params.args) ? intent.params.args : []
          });
          break;
          
        case 'nftMint':
          // Build NFT mint transaction with proper type casting
          transaction = await buildTransaction('nftMint', {
            name: intent.params.name || 'Untitled NFT',
            description: intent.params.description,
            url: intent.params.url
          });
          break;
          
        default:
          return;
      }
      
      if (transaction) {
        // Ask for confirmation
        const confirmMessage: Message = {
          id: generateId(),
          role: 'system',
          content: `I've prepared a ${intent.type} transaction. Would you like me to execute it now? Please respond with "yes" or "no".`,
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, confirmMessage]);
        
        // Store the transaction in component state to execute later if confirmed
        // (This would be implemented in a real app)
      }
    } catch (error) {
      console.error('Error building transaction:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        role: 'system',
        content: 'Sorry, there was an error building your transaction. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };


  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Chat cleared. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <Card className="flex flex-col bg-white rounded-lg shadow h-[600px]">
      <CardHeader className="flex-none border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">Sui Blockchain Assistant</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChat}
              className="text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Clear Chat
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : message.role === 'system'
                      ? 'bg-yellow-100 text-gray-800 border border-yellow-300'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="flex-none p-4 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="bg-primary hover:bg-blue-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
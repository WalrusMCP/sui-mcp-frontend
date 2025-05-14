import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
export const anthropic = new Anthropic({
  apiKey: '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', 
});

// Basic LLM request function
export async function askLlm(prompt: string, context: string = ''): Promise<string> {
  try {
    // Prepare system message with context about crypto and transactions
    const systemMessage = `
      You are a crypto assistant specializing in Sui blockchain transactions. 
      You can help users build transactions, query cryptocurrency prices, and understand blockchain concepts.
      
      ${context ? `Additional context: ${context}` : ''}
      
      When users want to perform actions on the blockchain:
      1. For transfers: Extract recipient address and amount
      2. For NFT minting: Extract name, description, and any properties
      3. For Move calls: Extract package ID, module, function, and arguments
      
      Keep your responses concise and focused on the user's request. 
      If you need more information to complete a transaction, ask for it.
    `;

    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemMessage,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    // Check if the content is text type
    if (message.content[0].type === 'text') {
      return message.content[0].text;
    }
    
    return "Sorry, I couldn't generate a text response.";
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    if (error instanceof Error) {
      return `Sorry, I encountered an error: ${error.message}`;
    }
    return 'Sorry, I encountered an unknown error. Please try again.';
  }
}

// Function to analyze user intent from message
export async function analyzeTransactionIntent(message: string): Promise<{
  type: 'transfer' | 'moveCall' | 'nftMint' | 'query' | 'unknown';
  params: Record<string, any>;
}> {
  try {
    const systemMessage = `
      You are a transaction parser. Analyze the user's message and determine what type of blockchain action they want to perform.
      Output a JSON object with:
      1. "type": "transfer", "moveCall", "nftMint", "query", or "unknown"
      2. "params": an object with the extracted parameters
      
      For "transfer": { recipient, amount }
      For "moveCall": { packageId, module, function, args }
      For "nftMint": { name, description, url }
      For "query": { asset, attribute } (e.g., price of BTC)
      For "unknown": {}
      
      Only output valid JSON.
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 500,
      temperature: 0.1,
      system: systemMessage,
      messages: [
        { role: 'user', content: message }
      ],
    });

    // Extract and parse the JSON response
    if (response.content[0].type === 'text') {
      const jsonMatch = response.content[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    // Fallback if no JSON was returned
    return {
      type: 'unknown',
      params: {}
    };
  } catch (error) {
    console.error('Error analyzing transaction intent:', error);
    return {
      type: 'unknown',
      params: {}
    };
  }
}
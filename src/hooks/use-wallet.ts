import { useState, useEffect, useCallback } from "react";
import { WalletState, WalletAdapter } from "@/lib/types";
import { MCPClient, suiWalletAdapter, walletConnectAdapter } from "@/lib/sui";
import { useToast } from "@/hooks/use-toast";

// Initialize client outside of component to maintain state across renders
const mcpClient = new MCPClient({
  network: 'testnet', // Default to testnet
});

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    connecting: false,
  });
  const { toast } = useToast();

  // Function to connect to a wallet
  const connect = useCallback(async (type: 'sui' | 'walletconnect' = 'sui') => {
    try {
      setWalletState((prev) => ({ ...prev, connecting: true, error: undefined }));

      const adapter: WalletAdapter = 
        type === 'sui' ? suiWalletAdapter : walletConnectAdapter;

      const address = await mcpClient.connectWallet(adapter);
      
      setWalletState({
        connected: true,
        connecting: false,
        address,
      });

      toast({
        title: "Wallet Connected",
        description: `Connected to address: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      return address;
    } catch (error) {
      const errorMessage = 
        error instanceof Error ? error.message : "Failed to connect wallet";
      
      setWalletState({
        connected: false,
        connecting: false,
        error: errorMessage,
      });

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  // Function to disconnect from a wallet
  const disconnect = useCallback(async () => {
    try {
      await mcpClient.disconnectWallet();
      
      setWalletState({
        connected: false,
        connecting: false,
      });

      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet",
      });
    } catch (error) {
      const errorMessage = 
        error instanceof Error ? error.message : "Failed to disconnect wallet";
      
      toast({
        title: "Disconnection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const address = mcpClient.getWalletAddress();
      
      if (address) {
        setWalletState({
          connected: true,
          connecting: false,
          address,
        });
      }
    };

    checkConnection();
  }, []);

  // Return the wallet state and functions
  return {
    ...walletState,
    connect,
    disconnect,
    mcpClient,
  };
}

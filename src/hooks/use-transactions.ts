import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MCPClient } from "@/lib/sui";
import { Transaction, TransactionResult } from "@/lib/types";
import { 
  TransferTransaction, 
  MoveCallTransaction, 
  NftMintTransaction 
} from "@shared/schema";

export function useTransactions(client: MCPClient, userId?: number) {
  const { toast } = useToast();
  const [buildingTx, setBuildingTx] = useState(false);
  const [executingTx, setExecutingTx] = useState(false);

  // Query user's transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: [userId ? `/api/users/${userId}/transactions` : null],
    enabled: !!userId,
  });

  // Build a transaction based on type
  const buildTransaction = useCallback(async (
    type: 'transfer' | 'moveCall' | 'nftMint',
    params: TransferTransaction | MoveCallTransaction | NftMintTransaction
  ): Promise<Transaction | null> => {
    try {
      setBuildingTx(true);
      let tx: Transaction;

      switch (type) {
        case 'transfer':
          tx = await client.buildTransferTransaction(params as TransferTransaction);
          break;
        case 'moveCall':
          tx = await client.buildMoveCallTransaction(params as MoveCallTransaction);
          break;
        case 'nftMint':
          tx = await client.buildNftMintTransaction(params as NftMintTransaction);
          break;
        default:
          throw new Error(`Unsupported transaction type: ${type}`);
      }

      return tx;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to build transaction";
      
      toast({
        title: "Transaction Build Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setBuildingTx(false);
    }
  }, [client, toast]);

  // Execute a transaction
  const executeTransaction = useCallback(async (tx: Transaction): Promise<TransactionResult | null> => {
    if (!client.getWalletAddress()) {
      toast({
        title: "No Wallet Connected",
        description: "Please connect a wallet to execute transactions",
        variant: "destructive",
      });
      return null;
    }

    try {
      setExecutingTx(true);
      
      const result = await client.signAndExecuteTransaction(tx);
      
      if (result.status === 'success') {
        toast({
          title: "Transaction Submitted",
          description: `Transaction ID: ${result.digest.slice(0, 8)}...`,
        });
        
        // Invalidate transactions query to refresh list
        if (userId) {
          queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/transactions`] });
        }
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to execute transaction";
      
      toast({
        title: "Transaction Execution Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setExecutingTx(false);
    }
  }, [client, toast, userId]);

  // Combine multiple transactions
  const aggregateTransactions = useCallback(async (txs: Transaction[]): Promise<Transaction | null> => {
    if (txs.length === 0) {
      toast({
        title: "No Transactions",
        description: "Need at least one transaction to aggregate",
        variant: "destructive",
      });
      return null;
    }

    try {
      setBuildingTx(true);
      
      const aggregatedTx = await client.aggregateTransactions(txs);
      
      return aggregatedTx;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to aggregate transactions";
      
      toast({
        title: "Transaction Aggregation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setBuildingTx(false);
    }
  }, [client, toast]);

  return {
    transactions,
    isLoadingTransactions,
    buildingTx,
    executingTx,
    buildTransaction,
    executeTransaction,
    aggregateTransactions,
  };
}

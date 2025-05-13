// Client-side utilities for interacting with the Sui blockchain
import { TransactionType, TransferTransaction, MoveCallTransaction, NftMintTransaction, AggregateTransaction } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { WalletAdapter, Transaction, TransactionResult } from "./types";

// Mock wallet adapters - in a real implementation, these would connect to actual wallets
class SuiWalletAdapter implements WalletAdapter {
  private connected = false;
  private accounts: string[] = [];
  private listeners: Record<string, Function[]> = {};

  async connect(): Promise<void> {
    // In a real implementation, this would connect to the Sui Wallet extension
    if (!this.connected) {
      this.connected = true;
      this.accounts = ["0x" + Math.random().toString(16).substring(2, 42)];
      this.emit('connect', this.accounts[0]);
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.accounts = [];
    this.emit('disconnect');
  }

  async getAccounts(): Promise<string[]> {
    return this.accounts;
  }

  async signTransaction(tx: Transaction): Promise<any> {
    // In a real implementation, this would request the wallet to sign the transaction
    return {
      ...tx,
      signed: true,
      signer: this.accounts[0]
    };
  }

  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  private emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach((callback) => {
      callback(...args);
    });
  }
}

class WalletConnectAdapter implements WalletAdapter {
  private connected = false;
  private accounts: string[] = [];
  private listeners: Record<string, Function[]> = {};

  async connect(): Promise<void> {
    // In a real implementation, this would initiate a WalletConnect session
    if (!this.connected) {
      this.connected = true;
      this.accounts = ["0x" + Math.random().toString(16).substring(2, 42)];
      this.emit('connect', this.accounts[0]);
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.accounts = [];
    this.emit('disconnect');
  }

  async getAccounts(): Promise<string[]> {
    return this.accounts;
  }

  async signTransaction(tx: Transaction): Promise<any> {
    // In a real implementation, this would request the wallet to sign the transaction
    return {
      ...tx,
      signed: true,
      signer: this.accounts[0]
    };
  }

  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  private emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach((callback) => {
      callback(...args);
    });
  }
}

// Main client for interacting with Sui blockchain
export class MCPClient {
  private network: string;
  private nodeUrl?: string;
  private defaultGasPrice?: string;
  private walletAdapter?: WalletAdapter;
  private walletAddress?: string;

  constructor(config: {
    network: 'mainnet' | 'testnet' | 'devnet';
    nodeUrl?: string;
    defaultGasPrice?: string;
  }) {
    this.network = config.network;
    this.nodeUrl = config.nodeUrl;
    this.defaultGasPrice = config.defaultGasPrice;
  }

  async connectWallet(adapter: WalletAdapter): Promise<string> {
    await adapter.connect();
    this.walletAdapter = adapter;
    
    const accounts = await adapter.getAccounts();
    if (accounts.length === 0) {
      throw new Error("No accounts found in wallet");
    }
    
    this.walletAddress = accounts[0];
    return this.walletAddress;
  }

  async disconnectWallet(): Promise<void> {
    if (!this.walletAdapter) {
      throw new Error("No wallet connected");
    }
    
    await this.walletAdapter.disconnect();
    this.walletAdapter = undefined;
    this.walletAddress = undefined;
  }

  getWalletAddress(): string | undefined {
    return this.walletAddress;
  }

  // Build transaction methods
  async buildTransferTransaction(params: TransferTransaction): Promise<Transaction> {
    const res = await apiRequest('POST', '/api/transactions/build/transfer', params);
    return await res.json();
  }

  async buildMoveCallTransaction(params: MoveCallTransaction): Promise<Transaction> {
    const res = await apiRequest('POST', '/api/transactions/build/move-call', params);
    return await res.json();
  }

  async buildNftMintTransaction(params: NftMintTransaction): Promise<Transaction> {
    const res = await apiRequest('POST', '/api/transactions/build/nft-mint', params);
    return await res.json();
  }

  async aggregateTransactions(transactions: Transaction[]): Promise<Transaction> {
    const res = await apiRequest('POST', '/api/transactions/build/aggregate', { 
      transactions 
    });
    return await res.json();
  }

  // Sign and execute transaction
  async signAndExecuteTransaction(tx: Transaction): Promise<TransactionResult> {
    if (!this.walletAdapter) {
      throw new Error("No wallet connected");
    }
    
    try {
      // Sign the transaction using the wallet adapter
      const signedTx = await this.walletAdapter.signTransaction(tx);
      
      // In a real implementation, we would submit this to the Sui node
      // For now, we'll just create a transaction record in our backend
      const transactionData = {
        userId: 1, // This would typically come from the authenticated user
        type: tx.txType,
        status: 'pending',
        details: tx.details
      };
      
      const res = await apiRequest('POST', '/api/transactions', transactionData);
      const transaction = await res.json();
      
      // Simulate a successful transaction
      setTimeout(async () => {
        const txDigest = "0x" + Math.random().toString(16).substring(2, 42);
        await apiRequest('PATCH', `/api/transactions/${transaction.id}/status`, {
          status: 'completed',
          txDigest
        });
      }, 2000);
      
      return {
        digest: transaction.id.toString(), // Temporary digest
        status: 'success',
        confirmedAtTimestamp: Date.now(),
        events: []
      };
    } catch (error) {
      console.error("Error executing transaction:", error);
      return {
        digest: "",
        status: 'failure',
        error: error instanceof Error ? error.message : "Unknown error",
        events: []
      };
    }
  }
}

// Export wallet adapters
export const suiWalletAdapter = new SuiWalletAdapter();
export const walletConnectAdapter = new WalletConnectAdapter();

// Type definitions for the MCP SDK
import { TransactionType } from "@shared/schema";

// Interface for wallet adapters
export interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<string[]>;
  signTransaction(tx: Transaction): Promise<TransactionResult>;
  on(event: string, callback: (event: string, ...args: unknown[]) => void): void;
  off(event: string, callback: (event: string, ...args: unknown[]) => void): void;
}

// Transaction interfaces
export interface Transaction {
  txBytes: string;
  txType: TransactionType | string;
  details: Record<string, unknown>;
}

export interface TransactionEvent {
  type: string;
  data: Record<string, unknown>;
}


export interface TransactionResult {
  digest: string;
  status: 'success' | 'failure';
  error?: string;
  confirmedAtTimestamp?: number;
  events: TransactionEvent[];
}

// SDK Configuration
export interface MCPClientConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  nodeUrl?: string;
  defaultGasPrice?: string;
}

// Wallet connection state
export interface WalletState {
  connected: boolean;
  address?: string;
  connecting: boolean;
  error?: string;
}

// Tab navigation state
export type TabType = 'c-user' | 'b-user';

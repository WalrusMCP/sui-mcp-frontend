import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ApiSectionProps {
  title: string;
  children: React.ReactNode;
}

const ApiSection: React.FC<ApiSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center p-4 focus:outline-none hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </Button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};

const ApiReference: React.FC = () => {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">API Reference</CardTitle>
      </CardHeader>
      <CardContent>
        {/* MCPClient Class */}
        <ApiSection title="MCPClient">
          <div className="prose max-w-none text-sm">
            <p>The main client for interacting with the MCP Manifest SDK.</p>
            
            <h4 className="font-medium mt-3">Constructor</h4>
            <div className="bg-gray-800 rounded-md overflow-hidden my-2">
              <pre className="overflow-x-auto p-3 text-xs text-gray-100 font-mono">
                <code>{`new MCPClient(config: {
  network: 'mainnet' | 'testnet' | 'devnet';
  nodeUrl?: string;
  defaultGasPrice?: string;
})`}</code>
              </pre>
            </div>
            
            <h4 className="font-medium mt-3">Methods</h4>
            <ul className="mt-2">
              <li><code>connectWallet(adapter: WalletAdapter): Promise&lt;void&gt;</code> - Connect to a wallet</li>
              <li><code>buildTransferTransaction(params): Promise&lt;Transaction&gt;</code> - Build a transfer transaction</li>
              <li><code>buildMoveCallTransaction(params): Promise&lt;Transaction&gt;</code> - Build a Move call transaction</li>
              <li><code>aggregateTransactions(txs: Transaction[]): Promise&lt;Transaction&gt;</code> - Combine multiple transactions</li>
              <li><code>signAndExecuteTransaction(tx: Transaction): Promise&lt;TxResult&gt;</code> - Sign and submit a transaction</li>
            </ul>
          </div>
        </ApiSection>
        
        {/* WalletAdapter Interface */}
        <ApiSection title="WalletAdapter">
          <div className="prose max-w-none text-sm">
            <p>Interface for wallet adapters that the SDK can use to connect to wallets.</p>
            
            <div className="bg-gray-800 rounded-md overflow-hidden my-2">
              <pre className="overflow-x-auto p-3 text-xs text-gray-100 font-mono">
                <code>{`interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<string[]>;
  signTransaction(tx: Transaction): Promise<SignedTransaction>;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
}`}</code>
              </pre>
            </div>
            
            <p className="mt-2">Available implementations:</p>
            <ul>
              <li><code>SuiWalletAdapter</code> - Adapter for the Sui Wallet browser extension</li>
              <li><code>WalletConnectAdapter</code> - Adapter for WalletConnect protocol</li>
            </ul>
          </div>
        </ApiSection>
        
        {/* Transaction Types */}
        <ApiSection title="Transaction Types">
          <div className="prose max-w-none text-sm">
            <p>Types for working with transactions in the SDK.</p>
            
            <div className="bg-gray-800 rounded-md overflow-hidden my-2">
              <pre className="overflow-x-auto p-3 text-xs text-gray-100 font-mono">
                <code>{`// Transaction parameters
interface TransferTxParams {
  recipient: string;       // Address to send to
  amount: string | number; // Amount in MIST
  objectId?: string;       // Optional specific coin to use
}

interface MoveCallTxParams {
  packageObjectId: string; // Package object ID
  module: string;          // Module name
  function: string;        // Function name
  typeArguments: string[]; // Type arguments
  arguments: any[];        // Function arguments
  gasBudget?: number;      // Optional gas budget
}

// Results
interface TxResult {
  digest: string;          // Transaction digest
  status: 'success' | 'failure';
  error?: string;
  confirmedAtTimestamp?: number;
  events: TransactionEvent[];
}`}</code>
              </pre>
            </div>
          </div>
        </ApiSection>
      </CardContent>
    </Card>
  );
};

export default ApiReference;

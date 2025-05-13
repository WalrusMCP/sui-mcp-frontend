import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickStartGuide: React.FC = () => {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Quick Start Guide</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Installation */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-2">Installation</h3>
          <div className="bg-gray-800 rounded-md overflow-hidden">
            <pre className="overflow-x-auto p-4 text-sm text-gray-100 font-mono">
              <code>npm install @mcp-manifest/sdk</code>
            </pre>
          </div>
        </div>

        {/* Basic Usage */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-2">Basic Usage</h3>
          <div className="bg-gray-800 rounded-md overflow-hidden">
            <pre className="overflow-x-auto p-4 text-sm text-gray-100 font-mono">
              <code>{`import { MCPClient, SuiWalletAdapter } from '@mcp-manifest/sdk';

// Initialize the client
const client = new MCPClient({
  network: 'mainnet', // or 'testnet', 'devnet'
  nodeUrl: 'https://sui-mainnet-rpc.example.com'
});

// Connect wallet
await client.connectWallet(SuiWalletAdapter);

// Create a simple transfer transaction
const tx = await client.buildTransferTransaction({
  recipient: '0x123...abc',
  amount: '1000000000', // amounts in MIST (1 SUI = 10^9 MIST)
});

// Sign and execute
const result = await client.signAndExecuteTransaction(tx);
console.log('Transaction digest:', result.digest);`}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;

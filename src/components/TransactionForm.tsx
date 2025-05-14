import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { useWallet } from "@/hooks/use-wallet";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionType } from "@shared/schema";

const TransactionForm: React.FC = () => {
  const { mcpClient, connected } = useWallet();
  // In a real app, we would get the user ID from authentication context
  // For the demo, we're using the demo user with ID 1
  const { buildTransaction, executeTransaction, buildingTx, executingTx } = useTransactions(mcpClient, 1);
  
  const [txType, setTxType] = useState<TransactionType>('transfer');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [packageId, setPackageId] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [functionName, setFunctionName] = useState('');
  
  const handleReset = () => {
    setRecipient('');
    setAmount('');
    setPackageId('');
    setModuleName('');
    setFunctionName('');
  };
  
  const handleBuildAndExecute = async () => {
    if (!connected) {
      return;
    }
    
    let params;
    switch (txType) {
      case 'transfer':
        params = {
          recipient,
          amount
        };
        break;
      case 'moveCall':
        params = {
          packageObjectId: packageId,
          module: moduleName,
          function: functionName,
          typeArguments: [],
          arguments: []
        };
        break;
      case 'nftMint':
        params = {
          name: "Test NFT",
          description: "A test NFT minted through MCP",
          url: "https://example.com/nft.png"
        };
        break;
      default:
        return;
    }
    
    const tx = await buildTransaction(txType, params);
    if (tx) {
      await executeTransaction(tx);
      handleReset();
    }
  };
  
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Transaction Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="tx-type" className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</Label>
          <Select
            value={txType}
            onValueChange={(value:any) => setTxType(value as TransactionType)}
            disabled={!connected || buildingTx || executingTx}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transfer">Transfer SUI</SelectItem>
              <SelectItem value="moveCall">Execute Move Call</SelectItem>
              <SelectItem value="nftMint">Mint NFT</SelectItem>
              <SelectItem value="aggregate">Aggregate Transaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {txType === 'transfer' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</Label>
              <Input
                type="text"
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
              />
            </div>
            <div>
              <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (SUI)</Label>
              <Input
                type="number"
                id="amount"
                placeholder="0.0"
                min="0"
                step="0.000000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
              />
            </div>
          </div>
        )}
        
        {txType === 'moveCall' && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="package-id" className="block text-sm font-medium text-gray-700 mb-1">Package ID</Label>
              <Input
                type="text"
                id="package-id"
                placeholder="0x..."
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="module-name" className="block text-sm font-medium text-gray-700 mb-1">Module Name</Label>
                <Input
                  type="text"
                  id="module-name"
                  placeholder="Module"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  disabled={!connected || buildingTx || executingTx}
                />
              </div>
              <div>
                <Label htmlFor="function-name" className="block text-sm font-medium text-gray-700 mb-1">Function Name</Label>
                <Input
                  type="text"
                  id="function-name"
                  placeholder="Function"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  disabled={!connected || buildingTx || executingTx}
                />
              </div>
            </div>
          </div>
        )}
        
        {txType === 'nftMint' && (
          <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-700">
            This will mint a test NFT with default parameters
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!connected || buildingTx || executingTx}
          >
            Reset
          </Button>
          <Button
            variant="default"
            onClick={handleBuildAndExecute}
            disabled={!connected || buildingTx || executingTx}
            className="bg-primary hover:bg-blue-600"
          >
            {buildingTx 
              ? 'Building...' 
              : executingTx 
                ? 'Executing...' 
                : 'Build & Execute Transaction'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;

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
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/hooks/use-wallet";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionType } from "@shared/schema";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TransactionBuilder: React.FC = () => {
  const { mcpClient, connected } = useWallet();
  const { buildTransaction, executeTransaction, buildingTx, executingTx } = useTransactions(mcpClient, 1); // Hardcoded user ID for demo
  
  const [txType, setTxType] = useState<TransactionType>('transfer');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [packageId, setPackageId] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [typeArguments, setTypeArguments] = useState('');
  const [functionArguments, setFunctionArguments] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftUrl, setNftUrl] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleReset = () => {
    setRecipient('');
    setAmount('');
    setPackageId('');
    setModuleName('');
    setFunctionName('');
    setTypeArguments('');
    setFunctionArguments('');
    setNftName('');
    setNftDescription('');
    setNftUrl('');
    setError(null);
    setSuccess(null);
  };
  
  const validateForm = (): boolean => {
    setError(null);
    
    if (txType === 'transfer') {
      if (!recipient.trim()) {
        setError('Recipient address is required');
        return false;
      }
      if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError('Please enter a valid amount greater than 0');
        return false;
      }
    } else if (txType === 'moveCall') {
      if (!packageId.trim()) {
        setError('Package ID is required');
        return false;
      }
      if (!moduleName.trim()) {
        setError('Module name is required');
        return false;
      }
      if (!functionName.trim()) {
        setError('Function name is required');
        return false;
      }
    } else if (txType === 'nftMint') {
      if (!nftName.trim()) {
        setError('NFT name is required');
        return false;
      }
    }
    
    return true;
  };
  
  const handleBuildAndExecute = async () => {
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setError(null);
    setSuccess(null);
    
    try {
      let params;
      switch (txType) {
        case 'transfer':
          params = {
            recipient,
            amount
          };
          break;
        case 'moveCall':
          // Parse type arguments and function arguments
          const parsedTypeArgs = typeArguments
            .split(',')
            .map(arg => arg.trim())
            .filter(arg => arg.length > 0);
          
          // For simplicity, we're parsing function arguments as strings
          // In a real implementation, we'd need more sophisticated parsing
          const parsedFuncArgs = functionArguments
            .split(',')
            .map(arg => arg.trim())
            .filter(arg => arg.length > 0);
          
          params = {
            packageObjectId: packageId,
            module: moduleName,
            function: functionName,
            typeArguments: parsedTypeArgs,
            arguments: parsedFuncArgs,
            gasBudget: 10000 // Default gas budget
          };
          break;
        case 'nftMint':
          params = {
            name: nftName,
            description: nftDescription || undefined,
            url: nftUrl || undefined
          };
          break;
        default:
          setError(`Unsupported transaction type: ${txType}`);
          return;
      }
      
      const tx = await buildTransaction(txType, params);
      if (tx) {
        const result = await executeTransaction(tx);
        if (result && result.status === 'success') {
          setSuccess(`Transaction submitted successfully with ID: ${result.digest.slice(0, 8)}...`);
          handleReset();
        } else {
          setError(result?.error || 'Transaction failed');
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Transaction Builder</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-6">
          <Label htmlFor="tx-type" className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</Label>
          <Select
            value={txType}
            onValueChange={(value) => {
              setTxType(value as TransactionType);
              setError(null);
            }}
            disabled={!connected || buildingTx || executingTx}
          >
            <SelectTrigger id="tx-type" className="w-full">
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
            <div>
              <Label htmlFor="type-arguments" className="block text-sm font-medium text-gray-700 mb-1">Type Arguments (comma separated)</Label>
              <Input
                type="text"
                id="type-arguments"
                placeholder="0x1::sui::SUI, 0x2::example::Token"
                value={typeArguments}
                onChange={(e) => setTypeArguments(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
              />
            </div>
            <div>
              <Label htmlFor="function-arguments" className="block text-sm font-medium text-gray-700 mb-1">Function Arguments (comma separated)</Label>
              <Textarea
                id="function-arguments"
                placeholder="arg1, arg2, arg3"
                value={functionArguments}
                onChange={(e) => setFunctionArguments(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
                className="min-h-[80px]"
              />
            </div>
          </div>
        )}
        
        {txType === 'nftMint' && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="nft-name" className="block text-sm font-medium text-gray-700 mb-1">NFT Name</Label>
              <Input
                type="text"
                id="nft-name"
                placeholder="My Awesome NFT"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
              />
            </div>
            <div>
              <Label htmlFor="nft-description" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</Label>
              <Textarea
                id="nft-description"
                placeholder="A description of my NFT"
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="nft-url" className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</Label>
              <Input
                type="text"
                id="nft-url"
                placeholder="https://example.com/image.png"
                value={nftUrl}
                onChange={(e) => setNftUrl(e.target.value)}
                disabled={!connected || buildingTx || executingTx}
              />
            </div>
          </div>
        )}
        
        {txType === 'aggregate' && (
          <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-700">
            <p>Transaction aggregation allows you to combine multiple transactions into a single transaction to save on gas fees and improve efficiency.</p>
            <p className="mt-2">To use this feature, first build individual transactions and then select them for aggregation.</p>
            <p className="mt-2 font-medium">This feature is currently under development.</p>
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

export default TransactionBuilder;

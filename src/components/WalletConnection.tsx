import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

const WalletConnection: React.FC = () => {
  const { connected, connecting, address, connect } = useWallet();

  const handleConnect = async (type: 'sui' | 'walletconnect') => {
    if (!connected) {
      await connect(type);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent>
        {connected && address && (
          <Alert className="bg-green-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <AlertTitle className="text-sm font-medium text-green-800">Wallet Connected</AlertTitle>
                <AlertDescription className="mt-2 text-sm text-green-700">
                  Address: <span className="font-mono">{address}</span>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="outline"
            className="wallet-option flex items-center justify-start p-4 border rounded-lg hover:bg-gray-50 transition-colors h-auto"
            onClick={() => handleConnect('sui')}
            disabled={connecting || connected}
          >
            <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-900">Sui Wallet</h3>
              <p className="text-xs text-gray-500">Browser Extension</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="wallet-option flex items-center justify-start p-4 border rounded-lg hover:bg-gray-50 transition-colors h-auto"
            onClick={() => handleConnect('walletconnect')}
            disabled={connecting || connected}
          >
            <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-900">Sui Mobile</h3>
              <p className="text-xs text-gray-500">Via QR Code</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="wallet-option flex items-center justify-start p-4 border rounded-lg hover:bg-gray-50 transition-colors h-auto"
            onClick={() => handleConnect('walletconnect')}
            disabled={connecting || connected}
          >
            <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-900">WalletConnect</h3>
              <p className="text-xs text-gray-500">Multi-Wallet Protocol</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnection;

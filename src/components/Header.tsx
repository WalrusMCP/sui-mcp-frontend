import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import Image from "next/image";

const Header: React.FC = () => {
  const { connected, connecting, address, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    if (connected) {
      await disconnect();
    } else {
      await connect('sui');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="rounded-md  from-[#6fbcf0] to-[#4CC2FF] p-2 mr-2">
                  <Image
                    src="/logo.png"
                    alt="MCP Logo"
                    width={50}   // 你可以根据需要调整宽高
                    height={50}
                    className="inline-block align-middle"
                  />
                </div>
                <span className="font-bold text-gray-800">SUI Gateway</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div id="connectionStatus" className="flex items-center text-sm">
              <span className="relative flex h-3 w-3 mr-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'
                    } opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${connected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                ></span>
              </span>
              <span className="status-text">
                {connected
                  ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : 'Not Connected'
                }
              </span>
            </div>
            <Button
              variant="default"
              onClick={handleConnect}
              disabled={connecting}
              className="inline-flex items-center"
            >
              {connecting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Connecting...
                </>
              ) : connected ? (
                'Disconnect Wallet'
              ) : (
                'Connect Wallet'
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

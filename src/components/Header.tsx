import React from "react";
import Image from "next/image";
import {ConnectButton} from '@suiet/wallet-kit';
const Header: React.FC = () => {

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="rounded-md  from-[#6fbcf0] to-[#4CC2FF] p-2 mr-2">
                  <a href="/">
                    <Image
                      src="/logo.png"
                      alt="MCP Logo"
                      width={50}   
                      height={50}
                      className="inline-block align-middle"
                    />
                  </a>
                </div>
                <span className="font-bold text-gray-800">SUI MCP Gateway</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div id="connectionStatus" className="flex items-center text-sm">
              <span className="relative flex h-3 w-3 mr-2">
              </span>
            </div>
          <ConnectButton className="min-w-0 px-2 py-1 text-sm" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

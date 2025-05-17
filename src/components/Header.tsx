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
                <span className="font-bold text-gray-800">SUI Walrus MCP Gateway</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div id="connectionStatus" className="flex items-center text-sm">
              <span className="relative flex h-3 w-3 mr-2">
              </span>
            </div>
          <ConnectButton className="min-w-0 px-2 py-1 text-sm" />
          <a
            href="https://x.com/walrusmcp"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hover:opacity-80 transition-opacity"
            aria-label="Twitter"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="6" fill="black"/>
              <path d="M17.53 6.47a.75.75 0 0 0-1.06 0l-4.47 4.47-4.47-4.47a.75.75 0 1 0-1.06 1.06l4.47 4.47-4.47 4.47a.75.75 0 1 0 1.06 1.06l4.47-4.47 4.47 4.47a.75.75 0 1 0 1.06-1.06l-4.47-4.47 4.47-4.47a.75.75 0 0 0 0-1.06z" fill="white"/>
            </svg>
          </a>
          <a
            href="https://github.com/WalrusMCP"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hover:opacity-80 transition-opacity"
            aria-label="GitHub"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.36.31.68.92.68 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" fill="#181717"/>
            </svg>
          </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

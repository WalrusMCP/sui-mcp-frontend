"use client";


import React, { useState } from "react";
import Header from "@/components/Header";
import { TabType } from "@/lib/types";
import TabNavigation from "@/components/TabNavigation";
// import ChatInterface from "@/components/ChatInterface";
// import TransactionHistory from "@/components/TransactionHistory";

import SdkOverview from "@/components/SdkOverview";
import QuickStartGuide from "@/components/QuickStartGuide";
import ApiReference from "@/components/ApiReference";
import ExampleProjects from "@/components/ExampleProjects";

export default function Landing() {
  const [activeTab, setActiveTab] = useState<TabType>('c-user');

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'c-user' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat with Sui Blockchain Assistant</h1>
              <p className="text-gray-600">Interact with the blockchain through natural language. Ask questions, build transactions, and get crypto info by simply chatting.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Chat interface replaces wallet connection and transaction builder */}
                {/* <ChatInterface /> */}
              </div>
              <div className="lg:col-span-1">
              </div>
            </div>
          </div>
        )}

        {activeTab === 'b-user' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">MCP Manifest SDK for Developers</h1>
              <p className="text-gray-600">Integrate with Sui blockchain easily using our developer-friendly SDK and tools.</p>
            </div>
              <SdkOverview />
              <QuickStartGuide />
              <ApiReference />
              <ExampleProjects />
          </div>
        )}


      </div>

    </div>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExampleProjects: React.FC = () => {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Example Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-medium text-gray-900">Simple Wallet Integration</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">Basic example showing how to connect a wallet and display balance.</p>
              <a href="#" className="text-primary hover:text-blue-700 text-sm font-medium">View Repository →</a>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-medium text-gray-900">NFT Marketplace</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">Complete example of NFT listing, buying and selling with MCP SDK.</p>
              <a href="#" className="text-primary hover:text-blue-700 text-sm font-medium">View Repository →</a>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-medium text-gray-900">DeFi Aggregator</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">Example of bundling multiple DeFi transactions for efficiency.</p>
              <a href="#" className="text-primary hover:text-blue-700 text-sm font-medium">View Repository →</a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExampleProjects;

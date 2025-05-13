import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SdkOverview: React.FC = () => {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">SDK Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <p>The MCP Manifest SDK provides a simplified way to integrate with the Sui blockchain. Our SDK handles wallet connections, transaction building, signing, and submission, allowing you to focus on your application logic.</p>
          
          <h3 className="text-base font-medium mt-4">Key Features</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>Simple wallet integration with support for multiple providers</li>
            <li>Transaction building and management</li>
            <li>Automatic retry and error handling</li>
            <li>Transaction bundling and optimization</li>
            <li>Event subscription for real-time updates</li>
            <li>TypeScript support with full type definitions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SdkOverview;

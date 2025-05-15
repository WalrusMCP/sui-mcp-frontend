import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockAssets = [
  {
    id: "asset1",
    name: "SUI",
    amount: "1000",
    symbol: "SUI",
    value: "$1200",
  },
  {
    id: "asset2",
    name: "USDT",
    amount: "500",
    symbol: "USDT",
    value: "$500",
  },
  {
    id: "asset3",
    name: "BTC",
    amount: "0.05",
    symbol: "BTC",
    value: "$3500",
  },
];

const AssetList: React.FC = () => {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Asset List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockAssets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No assets found. Connect your wallet to view your assets.
                    </td>
                  </tr>
                ) : (
                  mockAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.value}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetList;
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
// import { Transaction } from "@shared/schema";

const mockTransactions = [
  {
    id: "tx1",
    date: "2024-06-01",
    amount: "10 SUI",
    status: "Success",
    to: "0x1234...abcd",
  },
  {
    id: "tx2",
    date: "2024-06-02",
    amount: "5 SUI",
    status: "Pending",
    to: "0xabcd...1234",
  },
  {
    id: "tx3",
    date: "2024-06-03",
    amount: "2 SUI",
    status: "Failed",
    to: "0x5678...efgh",
  },
];

const TransactionHistory: React.FC = () => {
  const { connected } = useWallet();
  // In a real app, we would get the user ID from authentication context
  // For the demo, we're using the demo user with ID 1
  const userId = 1;
  
  // const { data: transactions = [], isLoading } = {mockTransactions, true} 
  
  // = useQuery<any[]>({
  //   queryKey: [connected ? `/api/users/${userId}/transactions` : null],
  //   enabled: connected,
  // });

  // Format time in "Today, 14:32" or "Yesterday, 09:45" format
  const formatTime = (timestamp: Date | string | number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    if (isToday) {
      return `Today, ${timeStr}`;
    } else if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }) + `, ${timeStr}`;
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              {/* <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No transactions found. Connect your wallet and make a transaction.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(tx.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        {tx.type === 'aggregate' && ` (${(tx.details.transactions || []).length} tx)`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                        {tx.txDigest ? (
                          <a 
                            href={`https://explorer.sui.io/transaction/${tx.txDigest}?network=testnet`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            View on Explorer
                          </a>
                        ) : (
                          <span className="text-gray-400">Pending...</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody> */}
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;

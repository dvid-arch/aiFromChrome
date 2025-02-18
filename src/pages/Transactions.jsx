import React from 'react';
import Header from '../components/Header';

const transactions = [
    { id: 1, date: '2024-08-24', type: 'Deposit', amount: 500, status: 'Completed' },
    { id: 2, date: '2024-08-22', type: 'Withdrawal', amount: 200, status: 'Pending' },
    { id: 3, date: '2024-08-20', type: 'Deposit', amount: 300, status: 'Completed' },
    { id: 4, date: '2024-08-18', type: 'Withdrawal', amount: 150, status: 'Failed' },
    // Add more transactions as needed
];

const TransactionsPage = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen py-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-green-700 to-blue-700 text-white rounded-t-xl">
                        <h1 className="text-3xl font-bold">Transaction History</h1>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-4 sm:pl-6 bg-gray-100 text-left text-sm font-medium text-gray-600">Date</th>
                                    <th className="py-4 sm:pl-6 bg-gray-100 text-left text-sm font-medium text-gray-600">Type</th>
                                    <th className="py-4 sm:pl-6 bg-gray-100 text-left text-sm font-medium text-gray-600">Amount</th>
                                    <th className="py-4 sm:pl-6 bg-gray-100 text-left text-sm font-medium text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition text-sm">
                                        <td className="py-4 pl-6 border-b border-gray-200">{transaction.date}</td>
                                        <td className="py-4 pl-6 border-b border-gray-200">{transaction.type}</td>
                                        <td className="py-4 pl-6  border-b border-gray-200">${transaction.amount}</td>
                                        <td
                                            className={`py-4 pl-6 text-[12px] border-b border-gray-200 font-semibold ${transaction.status === 'Completed'
                                                    ? 'text-green-600'
                                                    : transaction.status === 'Pending'
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600'
                                                }`}
                                        >
                                            {transaction.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionsPage;

import { useState } from "react";
import Deposit from "../components/Deposit";
import Header from "../components/Header";

const NoInvestmentsDashboard = () => {
    let [deposit,setDeposit] = useState(false)
    const investmentPlans = [
        { id: 1, name: 'Starter Plan', dailyProfit: 5, minInvestment: 100 },
        { id: 2, name: 'Standard Plan', dailyProfit: 10, minInvestment: 500 },
        { id: 3, name: 'Pro Plan', dailyProfit: 15, minInvestment: 1000 },
    ];

    const [copied, setCopied] = useState(false);
    const referralLink = "https://example.com/register?referral=123456";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <>
            <Header />
            <div className="min-h-screen p-4 bg-gray-50">

                {/* Choose Investment Plan Section */}
                <div className="bg-gradient-to-b from-green-800 via-green-700 to-green-600  shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Wallet Balance</h2>
                    <p className="text-4xl font-bold mt-2 text-white">${0.00}</p>
                    <div className="mt-4 space-x-4">
                        <button
                            onClick={()=>setDeposit(true)}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Deposit
                        </button>
                        <button
                            
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Choose an Investment Plan</h2>
                    <div className="mt-4  md:grid grid-cols-3 gap-8 ">
                        {investmentPlans.map((plan) => (
                            <div key={plan.id} className="mt-4 bg-gray-100 p-4 rounded-lg">
                                <div className="flex flex-col space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-700">{plan.name}</h3>
                                    <p className="text-gray-600">Daily Profit: {plan.dailyProfit}%</p>
                                    <p className="text-gray-600">Minimum Investment: ${plan.minInvestment}</p>
                                    <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                        Choose Plan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Referral Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800">Make Referrals and Earn!</h2>
                    <p className="text-gray-600 mt-2">
                        Share your referral link to earn extra income when your friends join and invest.
                    </p>
                    <div className="flex items-center mt-4 space-x-2">
                        <input
                            type="text"
                            value={referralLink}
                            readOnly
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {copied ? "Copied!" : "Copy Link"}
                        </button>
                    </div>
                </div>
                {deposit && <Deposit />}
            </div>
        </>
    );
};

export default NoInvestmentsDashboard;

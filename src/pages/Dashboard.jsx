import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Terminate from '../components/prompts/Terminate';
import Deposit from '../components/Deposit';



const Dashboard = () => {
    const walletBalance = 1500; // Sample balance
    const [deposit, setDeposit] = useState(false)
    const [terminate, setTerminate] = useState({ value: false, id: null });
    const [confirmedTerminate, setConfirmedTerminate] = useState(false)
    const [terminateInput, setTerminateInput] = useState('')
    const referralEarnings = [
        { id: 1, amount: 200, date: '2024-10-01' },
        { id: 2, amount: 50, date: '2024-09-28' },
        { id: 3, amount: 100, date: '2024-09-15' },
    ];

    const investments = [
        {
            id: 1,
            name: 'Investment A',
            totalEarnings: 300,
            todayProfit: 20,
        },
        {
            id: 2,
            name: 'Investment B',
            totalEarnings: 150,
            todayProfit: 10,
        },
        {
            id: 3,
            name: 'Investment C',
            totalEarnings: 500,
            todayProfit: 25,
        },
    ];

    useEffect(() => {
        if (terminate.value) {
            setTerminate({ value: false, id: null })
        }
        setConfirmedTerminate(false)
    }, [confirmedTerminate])


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
            <div className="min-h-screen p-4 bg-gray-50 flex flex-col md:flex-row lg:flex-col">

                {/* Wallet Balance Section */}

                <div className='mb-4 flex flex-wrap gap-2 sm:hidden'>
                    <span className='border inline-block shadow-md rounded-md px-2 py-1 border-blue-500'> referral earnings </span>
                    <span className='border inline-block shadow-md rounded-md px-2 py-1 border-blue-500'>invest</span>
                </div>
                <div className='flex flex-col lg:flex-row  gap-8 flex-1'>
                    <Wallet walletBalance={walletBalance} setDeposit={setDeposit} />
             
                    <Referral handleCopyLink={handleCopyLink} copied={copied} referralEarnings={referralEarnings} referralLink={referralLink}  />
                </div>
                <div className="md:flex gap-8 flex-1">

                    {/* Investment Earnings Section */}
                    <div className=" flex-1  rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-green-500">Investment Earnings</h2>
                        <ul className="mt-4 grid grid-cols-1  lg:grid-cols-3 gap-8 ">
                            {investments.map((investment, i) => (
                                <li key={investment.id} className="shadow-md relative bg-blue-100 p-4 rounded-lg">
                                    <div className="flex flex-col space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-700">{investment.name}</h3>
                                        <p className="text-gray-600">Total Earnings: ${investment.totalEarnings}</p>
                                        <p className="text-gray-600 ">Today's Profit: ${investment.todayProfit}</p>
                                        <br />
                                        <div className="flex md:gap-4 flex-col md:flex-row gap-2 ">
                                            <button className="w-fit px-4 block  bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                                Withdraw Today's Profit
                                            </button>
                                            <a href='#terminate'
                                                onClick={() => setTerminate({ value: true, id: i })}
                                                className=" w-fit px-4 block bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                                                Terminate
                                            </a>
                                        </div>
                                    </div>
                                    {(terminate.value && terminate.id == i) &&
                                        <div id='terminate' className='p-4 absolute shadow-md rounded-md top-[110%]  w-full left-0 bg-red-50'>
                                            <p className='mb-2'>Please type in "Terminate" in the input below to confirm this action</p>
                                            <input type="text" className='text-xl  py-1 px-4 bg-white/50 border-2 block w-full' />
                                            <p className='text-sm mb-2 text-red-600'>**you will get back 80% of your invested capital on this investment <a href="#" className='inline-block  text-[12px] font-bold text-blue-500 '>learn more</a></p>
                                            <div className='flex gap-4 mt-4'>
                                                <button
                                                    onClick={() => setConfirmedTerminate(true)}
                                                    className=" w-fit px-4 block bg-white text-red-500 py-2 rounded-lg hover:bg-red-600 hover:text-white ">
                                                    Terminate
                                                </button>
                                                <button
                                                    onClick={() => setTerminate({ value: false, id: null })}
                                                    className=" w-fit px-4 block bg-white text-blue-500 py-2 rounded-lg hover:bg-blue-600 hover:text-white ">
                                                    cancel
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </li>
                            ))}
                        </ul>
                        <div className="bg-white mt-8 shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800">Add to Your Investments</h2>
                            <p className="text-gray-600 mt-2">
                                Boost your earnings by adding more to your current investments.
                            </p>
                            <div></div>
                            <button className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                                Add to Investments
                            </button>
                        </div>
                    </div>


                    {deposit && <Deposit setDeposit={setDeposit} />}
                </div>
            </div>

        </>
    );
};

function Wallet({ walletBalance, setDeposit }) {
    return (
        <div className="lg:max-h-[300px] flex flex-col justify-center  lg:flex-1 md:flex-none bg-green-950/80 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Wallet Balance</h2>
            <p className="text-4xl font-bold text-green-500 mt-2">${walletBalance}</p>
            <div className="mt-4 space-x-4">
                <button
                    onClick={() => setDeposit(true)}
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
    )
}


function Referral({ referralEarnings, referralLink, copied, handleCopyLink }) {
    return (
        <div className='flex  flex-1 flex-col'>

            <div className=" rounded-lg p-6 bg-white mb-6">
                <div className='flex justify-between'>

                    <h2 className=" relative text-xl font-semibold  text-green-500">Referral Earnings</h2>
                    <a href="#" className='text-blue-700'>see more</a>
                </div>
                <ul className="mt-4 space-y-2">
                    {referralEarnings.slice(0, 3).map((earning) => (
                        <li key={earning.id} className="flex justify-between bg-gray-100 p-4 rounded-lg">
                            <span className="text-gray-700">Earned: ${earning.amount}</span>
                            <span className="text-gray-500 text-sm">{earning.date}</span>
                        </li>
                    ))}
                </ul>
                <div className=" rounded-lg ">

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
            </div>

            {/* Add to Investments Section */}

        </div>
    )
}

export default Dashboard;

import Logo from "../components/Logo"

import raster from "../assets/raster.svg"
import grow from "../assets/grow.png"
import withdraw from "../assets/withdraw.png"
import secure from "../assets/secure.png"
import customer from "../assets/customer.png"
import { useEffect, useState } from "react"
import Table from "../components/Table"
import Footer from "../components/Footer"

function LandingPage() {

  const transactions = [
    { id: 1, date: '1,7000', type: 'Deposit', amount: 500, },
    { id: 2, date: '17,000', type: 'Withdrawal', amount: 200, },
    { id: 3, date: '170,000', type: 'Deposit', amount: 300, },
    { id: 4, date: '1,700,000', type: 'Withdrawal', amount: 150, },
    // Add more transactions as needed
  ];


  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`px-8 py-4 sticky z-20 top-0 bg-[#f4f4f4] ${shadow && "bg-white/20  shadow-md backdrop-blur-sm"}`} >
        <div className="flex gap-8 items-center container mx-auto">
          <Logo />
          <nav className="hidden pl-8 max-w-[400px] md:flex flex-1 text-[18px] font-semibold justify-between">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Services</a>
          </nav>
          <div className="flex-1 flex gap-2 md:gap-8 text justify-end">
            <button className="   md:py-2 px-2 md:text-xl font-semibold md:px-8 border bg-green-400">Register</button>
            <button className="py-2 px-2 md:text-xl font-semibold md:px-8 border border-green-400">sign in</button>

          </div>
        </div>

      </header>
      <section className="bg-[#f4f4f4]">
        <div className="py-20 flex flex-col  items-center container mx-auto px-8">
          <h1 className="md:text-6xl text-4xl text-slate-700 max-w-[800px] mb-10 text-center font-bold">Earn Up to <span class="bold text-green-500 text-6xl md:text-8xl">5%</span> Weekly with Low-Risk Investments</h1>
          <p className="text-xl text-slate-500 max-w-[600px] text-center mb-8">Invest in carefully selected ventures with confidence. Grow your wealth steadily and securely.</p>
          <div className="flex gap-8">
            <button className="hidden md:block py-2 text-xl font-semibold px-8 border bg-green-400">Register</button>
            <button className="button-85 flex items-center" role="button">Start Investing <svg xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" className="mui-15fzge ed1092o3">
              <path d="M17 7l-10 10"></path>
              <path d="M8 7l9 0l0 9"></path>
            </svg></button>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="bg-black/90 text-white/80">
        <div className="flex flex-col md:grid grid-cols-6 gap-4 grid-rows-5 px-8 py-20 max-w-[1000px] mx-auto ">
          <div className="col-span-2 row-span-5 h-full border border-green-950 bg-no-repeat bg-right-top flex flex-col px-8 text-center items-center justify-center bg-white/20  shadow-md backdrop-blur-sm  border-green-900/30" >
            <img src={grow} alt="grow" className="w-[60%] " />
            <h2 className="bg-black/20 py-1 px-2 rounded-md mb-5">Grow your Wealth</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur laudantium est ipsam quo corporis!</p>
          </div>
          <div className="col-span-2 row-span-3  border border-green-950 p-6 bg-no-repeat bg-right-top flex flex-col px-8 text-center items-center justify-center bg-white/20  shadow-md backdrop-blur-sm  border-green-900/30">
            <img src={withdraw} alt="grow" className="w-[60%] " />
            <h2 className="bg-black/20 py-1 px-2 rounded-md mb-5">Easy Withdrawal</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          </div>
          <div className="col-span-2 row-span-4  border border-green-950 p-6 bg-no-repeat bg-right-top flex flex-col px-8 text-center items-center justify-center bg-white/20  shadow-md backdrop-blur-sm  border-green-900/30">
            <img src={secure} alt="grow" className="w-[60%] " />
            <h2 className="bg-black/20 py-1 px-2 rounded-md mb-5">Safe and Secure Account</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          </div>
          <div className="col-span-2 row-span-2  border border-green-950 p-6 bg-no-repeat bg-right-top flex flex-col px-8 text-center items-center justify-center bg-white/20  shadow-md backdrop-blur-sm  border-green-900/30">
            <img src={customer} alt="grow" className="w-[40%] " />
            <h2 className="bg-black/20 py-1 px-2 rounded-md mb-5">Safe and Secure Account</h2>
          </div>
          <div className="col-span-2 row-span-1  border border-green-950 px-8 py-4">
            <button className="py-2 text-xl font-semibold px-8 border">learn more</button>
          </div>

        </div>
      </section>
      <section className="py-20 px-8 bg-blue-950/20">
        <div className="container mx-auto">

          <h2 className="mb-10 font-bold text-4xl text-center">Why Choose Earn!</h2>
          <div className="flex flex-col gap-4 md:flex-row md:gap-12  justify-around">
            <div className="w-fit text-center text-[18px] mx-auto">
              <h3 className="mb-4 text-2xl capitalize font-bold">perpertual Earnings</h3>
              <p className="text-center max-w-sm">Earn utilizes some of the best technique to grow your wealth, recieve daily income and transfer to your account</p>

            </div>
           
          </div>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="container mx-auto  w-fit">

          <h2 className="text-xl text-slate-400 font-bold mb-10">Here from Other Users</h2>
          <div className="flex gap-10">
            <div className="  gap-8  relative">
              <div className="w-[300px] h-[400px] bg-slate-400 rounded-md">
                <img src="" alt="" />
              </div>
              <div className="absolute top-[50%] px-4">
                <p className="text-2xl max-w-[300px]">...Before I invested in unsafe business and got scammed Earn changed all of that</p>
              </div>
            </div>
            <div className="hidden md:block gap-8 translate-y-10 mt-10 relative">
              <div className="w-[300px] h-[400px] bg-slate-400 rounded-md">
                <img src="" alt="" />
              </div>
              <div className="absolute top-[50%] px-4">
                <p className="text-2xl max-w-[300px]">...Before I invested in unsafe business and got scammed Earn changed all of that</p>
              </div>
            </div>
            <div className="hidden md:block  gap-8 translate-y-20 mt-20 relative">
              <div className="w-[300px] h-[400px] bg-slate-400 rounded-md">
                <img src="" alt="" />
              </div>
              <div className="absolute top-[50%] px-4">
                <p className="text-2xl max-w-[300px]">...Before I invested in unsafe business and got scammed Earn changed all of that</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-yellow`-900/50  mt-10">
        <div className="container mx-auto max-w-[800px]  px-8 ">
          <p className="text-red-500">We have a Limit of how much investments we can handle, invest before the target is met</p>
          <h2 className="font-bold mb-6">PLANS AND WHAT YOU GET DAILY</h2>
          <div>
            <div className="">
              <div className="flex flex-col gap-2 ">
                <div className=" border p-4 grid grid-cols-3  capitalize">
                  <p>N17,000</p>
                  <p>N85</p>
                  <button className="px-4 py-1 rounded-md text-white bg-green-500 font-bold tracking-wider block w-fit mx-auto">invest</button>
                </div>
                <div className=" border p-4 grid grid-cols-3  capitalize">
                  <p>N170,000</p>
                  <p>N85 + <span className="inline-block p-1 bg-white/60">weekly Bonus</span></p>
                  <button className="px-4 py-1 rounded-md text-white bg-green-500 font-bold tracking-wider block w-fit mx-auto">invest</button>
                </div>
                <div className=" border p-4 grid grid-cols-3  capitalize bg-black/30">
                  <p>N1,700,000</p>
                  <p>N85 + <span className="inline-block p-1 bg-black/60 font-bold border border-green-500 text-white">daily Bonuses</span></p>
                  <button className="px-4 py-1 rounded-md text-white bg-green-500 font-bold tracking-wider block w-fit mx-auto">invest</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     
      <Footer />
    </>
  )
}

export default LandingPage
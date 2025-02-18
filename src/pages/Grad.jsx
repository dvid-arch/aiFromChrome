import React from 'react'

function Grad() {
    return (
        <div>

            <div className='overflow-hidden relative pb-20 min-h-screen'>
                <div className="circPosition w-[520px] h-[400px] bg-green-500 rounded-[100%] absolute z-1 top-[10%] right-[-30%] translate-x-[-40%] translate-y-[-40%]  blur-[150px] "></div>
                <div className="circPosition w-[520px] h-[400px] bg-green-500/70 rounded-[100%] absolute z-1 bottom-[10%] left-[-30%] translate-x-[50%] translate-y-[60%]  blur-[450px] "></div>
                <div className="center m-[auto] w-[70%] relative z-10">
                    <h2 className='text-[50px] font-bold text-center  mt-20'>Where would you like to go?</h2>
                    <p className='text-[16px] text-[#706f6f] info text-center'>Explore your travel opportunities with us!</p>
                    <div className="blurText relative z-10 bg-[#e3e3e3]/40 rounded-lg p-5 mx-auto  mt-[50px]">
                        <div className="category flex gap-10 mb-[25px]">
                            <p className='font-bold'>Flights</p>
                            <p>Hotels</p>
                            <p>Cars</p>
                        </div>
                        <div className='inside flex gap-[60px]'>

                            <div className="box1 bg-[#ffffff] p-[25px] rounded-[20px]">
                                <p>Leaving from</p>
                                <h2>Georgia, Tbilisi</h2>
                            </div>
                            <div className="box1">
                                <p>Destination</p>
                                <h2>France, Paris</h2>
                            </div>
                            <div className="box1">
                                <p>Passenger</p>
                                <h2>2 adults, 3 children, 1 pet</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Grad
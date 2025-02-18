import React, { useEffect, useState } from 'react'
import Logo from '../components/Logo';
import earnLogo from '../assets/logo.svg'
import Input from '../components/Input';

function Auth() {
    const sideStyle = 'md:flex-1 md:min-h-screen flex flex-col-reverse md:flex-col justify-center items-center md:gap-6 gap-1 py-6 transition delay-600'
    const [animateSideStyle, setAnimateSideStyle] = useState(false);
    
    useEffect(() => {
      setTimeout(() => {
        setAnimateSideStyle(true)
      }, 500);
    }, [])
  return (
    <>
        <div className="flex flex-col gap-8  md:gap-0 md:flex-row px-4 ">
            <div className={!animateSideStyle ? sideStyle + ' opacity-0':sideStyle + ' opacity-100 bg-no-repeat bg-contain bg-bottom'} >
                <h1 className=" text-4xl max-w-[480px] sm:text-4xl md:text-6xl text-center md:text-left transition ">Begin your journey to making the best grades</h1>
                
            </div>
            <div className="md:h-screen md:flex-1 overflow-auto flex justify-center items-center py-6">
                <form  className="block w-full max-w-[360px]  py-6 px-6 border shadow-lift">
                    <h2 className="text-3xl text-center mb-8 font-bold">Create Account</h2>
                    <div className="flex gap-1 justify-center items-center mb-6">
                        <span className="w-10 h-10 block rounded-md border"></span>
                        <span className="w-10 h-10 block rounded-md border"></span>
                        <span className="w-10 h-10 block rounded-md border"></span>
                        <span className="w-10 h-10 block rounded-md border"></span>
                    </div>
                    <p className='text text-center font-lighter py-1 text-slate-600'>or use your email to register</p>
                    <div className="flex flex-col gap-4">
                        <Input placeholder={'name'} />
                        <Input placeholder={'email'}/>
                        <Input placeholder={'password'} />
                    </div>
                    <button className="block w-full py-[10px] px-[15px] border-primary border mt-6 bg-primary text-white mb-2 rounded-lg">Log in</button>
                    <p className="text-centers text-slate-600">have an account already? <a href="#" className="text-primary" onClick={()=>setLogin(true)}>Log in</a></p>
                </form>
            </div>
        </div>
    </>
  )
}

export default Auth
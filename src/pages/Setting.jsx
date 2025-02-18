import Header from "../components/Header"

function Setting() {
    return (
        <>
            <Header />
            <section className="bg-slate-50 pt-[20dvh] md:pt-[10dvh]">

            <div className="flex flex-col gap-4 px-8 text-slate-700 max-w-[800px] mx-auto">
                <div className="py-8 border-b-[2px]">
                    <h2 className="text-2xl font-bold">Your Profile</h2>
                    <p className="text-slate-500 mb-4">Choose how you are displayed</p>
                    <form>
                        <div className="mb-4">

                            <div className="flex flex-col max-w-[280px]">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="bg-white border py-[6px] px-[24] rounded-md" />
                            </div>
                          
                        </div>
                        <button className="inline-block py-[6px] px-[24px] bg-blue-700 text-white font-semibold rounded-md">Save Changes</button>
                    </form>
                </div>

                <div className="py-8 border-b-[2px]">
                    <h2 className="text-2xl font-bold">Email and Phone</h2>
                    <p className="text-slate-500 max-w-[500px] mb-4">Manage the email and phone you use to sign into ExamRedi and recieve notifications</p>
                    <form>
                        <div className="flex gap-4">

                            <div>
                                <label htmlFor="email">Email</label>
                                <div className="flex gap-4">  <input type="text" className="bg-white border py-[6px] px-[24] rounded-md" /> <button className="bg-blue-700 px-[24px] py-[6px] rounded-md text-white font-bold">Update</button></div>
                            </div>
                            <div>
                                <label htmlFor="email">Phone</label>
                                <div className="flex gap-4">  <input type="text" className="bg-white border py-[6px] px-[24] rounded-md" /> <button className="bg-blue-700 px-[24px] py-[6px] rounded-md text-white font-bold">Update</button></div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="py-8 border-b-[2px]">
                    <h2 className="text-2xl font-bold">Transaction Details</h2>
                    <p className="text-slate-500 max-w-[500px] mb-4">Manage the email and phone you use to sign into ExamRedi and recieve notifications</p>
                    <form>
                        <div className="flex gap-4">

                            <div>
                                <label htmlFor="accno">Account Number</label>
                                <div className="flex gap-4">  <input type="text" className="bg-white border py-[6px] px-[24] rounded-md" /> <button className="bg-blue-700 px-[24px] py-[6px] rounded-md text-white font-bold">Update</button></div>
                            </div>
                            <div>
                                <label htmlFor="accname">Account Name</label>
                                <div className="flex gap-4">  <input type="text" className="bg-white border py-[6px] px-[24] rounded-md" /> <button className="bg-blue-700 px-[24px] py-[6px] rounded-md text-white font-bold">Update</button></div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="py-8 border-b-[2px]">
                    <h2 className="text-2xl font-bold">Delete Account</h2>
                    <p className="text-slate-500 max-w-[500px] mb-4">
                        if you no longer wish to use EARN, you can permanently delete your account.
                    </p>
                    <button className="inline-block py-[6px] px-[24px] bg-red-500 text-white font-semibold rounded-md">Delete Account</button>
                </div>
            </div>
        </section>
        </>
    )
}

export default Setting
import { TbArrowDown } from "react-icons/tb"
import { Link } from "react-router-dom"


const AdvertisementNavbar = () => {
    return (
        <nav className="border-y-2 border-slate-400 font-medium text-slate-800">
            <div className="flex gap-3 px-4 text-[.9rem]">
                <div className="group relative z-10">
                    <button className="flex items-center gap-1 py-1">
                        Payment methods
                        <TbArrowDown size={18} className="transition-all duration-500 group-focus-within:rotate-180" />
                    </button>
                    <div className="transition-all duration-500 opacity-0 -translate-y-4 invisible group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 absolute left-0 top-8 min-w-[17rem]">
                        <ul className=" bg-white p-3 min-w-[15rem] border rounded shadow-lg text-base">
                            <li className="flex"><Link to={`/profile/freelancer/advertisements/payment-methods`} className="border-b p-2 w-full hover:bg-slate-100 hover:rounded">My payment methods</Link></li>
                            <li className="flex"><Link to={`/profile/freelancer/advertisements/payment-methods/create`} className="p-2 w-full hover:bg-slate-100 hover:rounded">Add a payment method</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="group relative z-10">
                    <button className="flex items-center gap-1 py-1">
                        Campaigns
                        <TbArrowDown size={18} className="transition-all duration-500 group-focus-within:rotate-180" />
                    </button>
                    <div className="transition-all duration-500 opacity-0 -translate-y-4 invisible group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 absolute right-0 top-8 cursor-pointer min-w-[17rem]">
                        <ul className=" bg-white p-3 min-w-[15rem] border rounded shadow-lg text-base">
                            <li className="flex"><Link to={`/profile/freelancer/advertisements/campaigns`} className="border-b p-2 w-full hover:bg-slate-100 hover:rounded">My Campaigns</Link></li>
                            <li className="flex"><Link to={`/profile/freelancer/advertisements/create/campaign`} className="p-2 w-full hover:bg-slate-100 hover:rounded">Create new campaign</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdvertisementNavbar
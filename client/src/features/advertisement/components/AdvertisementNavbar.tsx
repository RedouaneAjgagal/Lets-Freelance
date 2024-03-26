import { TbArrowDown } from "react-icons/tb"
import { Link } from "react-router-dom"


const AdvertisementNavbar = () => {
    return (
        <nav className="border-y-2 border-slate-400 font-medium text-slate-800">
            <div className="flex gap-3 px-4 text-[.9rem]">
                <div className="group relative">
                    <button className="flex items-center gap-1 py-1">
                        Payment methods
                        <TbArrowDown size={18} className="transition-all duration-500 group-hover:rotate-180" />
                    </button>
                    <div className="transition-all duration-500 opacity-0 -translate-y-4 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 pt-1 absolute left-0 top-8">
                        <ul className=" bg-white p-3 min-w-[15rem] border rounded shadow-lg text-base">
                            <li className="flex"><Link to={`/`} className="border-b py-2 w-full">My payment methods</Link></li>
                            <li className="flex"><Link to={`/`} className="py-2 w-full">Add a payment method</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="group relative">
                    <button className="flex items-center gap-1 py-1">
                        Campaigns
                        <TbArrowDown size={18} className="transition-all duration-500 group-hover:rotate-180" />
                    </button>
                    <div className="transition-all duration-500 opacity-0 -translate-y-4 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 pt-1 absolute right-0 top-8">
                        <ul className=" bg-white p-3 min-w-[15rem] border rounded shadow-lg text-base">
                            <li className="flex"><Link to={`/`} className="border-b py-2 w-full">My Campaigns</Link></li>
                            <li className="flex"><Link to={`/`} className="py-2 w-full">Create new campaign</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdvertisementNavbar
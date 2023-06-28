import { Link } from 'react-router-dom'

const BrandRessources = () => {
    return (
        <div className="py-6 border-y border-slate-100/20 grid gap-8">
            <div className="flex flex-col gap-2 text-slate-200/80">
                <h2 className="font-semibold text-white">Company</h2>
                <Link to={"/"}>About Us</Link>
                <Link to={"/"}>Contact Us</Link>
                <Link to={"/"}>Become Seller</Link>
                <Link to={"/"}>Jobs on Lets Freelance</Link>
            </div>
            <div className="flex flex-col gap-2 text-slate-200/80">
                <h2 className="font-semibold text-white">Ressources</h2>
                <Link to={"/"}>Help & Support</Link>
                <Link to={"/"}>Affiliate Program</Link>
                <Link to={"/"}>FAQ</Link>
            </div>
            <div className="flex flex-col gap-2 text-slate-200/80">
                <h2 className="font-semibold text-white">Categories</h2>
                <Link to={"/"}>Development & IT</Link>
                <Link to={"/"}>Design & Creative</Link>
                <Link to={"/"}>Digital Marketing</Link>
                <Link to={"/"}>Writing & Translation</Link>
                <Link to={"/"}>Video & Animation</Link>
                <Link to={"/"}>Finance & Accounting</Link>
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-white">Subscribe</h2>
                <form action="/subscribe" noValidate className="bg-purple-400/50 rounded h-full flex">
                    <label htmlFor="subscribe" className="w-full p-2 cursor-text">
                        <input type="email" id="subscribe" name="subscribe" autoComplete="off" className="p-1 h-full w-full outline-none bg-transparent placeholder:text-slate-100/60" placeholder="Your Email Address" />
                    </label>
                    <div className="flex">
                        <button className="text-white font-medium px-4">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BrandRessources
import { Link } from "react-router-dom";
import { TrustedBy } from "../components/home";

import "swiper/css"
import 'swiper/css/navigation';
import "swiper/swiper-bundle.esm.js"

const Home = () => {


  return (
    <div>
      <div className="bg-purple-100/60 px-4 py-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold text-purple-800 leading-[1.3]">Hire Experts & Get Your Job Done.</h1>
          <p className="text-slate-500 leading-[1.6]">Work with talented people at the most affordable price to get the most out of your time and cost.</p>
          <Link to="/auth/register" className="self-start px-3 py-2 bg-purple-800 text-white font-medium rounded">Get started</Link>
          <div className="flex flex-col gap-4">
            <p className="text-slate-400 font-medium"><span>Trusted by</span></p>
            <TrustedBy />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
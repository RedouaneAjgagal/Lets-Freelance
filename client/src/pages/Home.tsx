import { Link } from "react-router-dom";
import { TrustedBy, TrendingServicesList, TalentByCategoryList, LatestJobsList, HighestRatedFreelancersList, WhyUsProofList } from "../components/home";
import { BiArrowBack } from "react-icons/bi";

const Home = () => {


  return (
    <div className="flex flex-col gap-10">
      <div className="bg-purple-100/20 px-4 py-8">
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
      <div className="px-4 flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Trending Services</h2>
        <p className="text-slate-500 text-sm leading-relaxed">Most viewed and all-time top-selling services</p>
        <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Services <BiArrowBack className="rotate-180" /></Link>
        <TrendingServicesList />
      </div>
      <div className="px-4 flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Browse talent by category</h2>
        <p className="text-slate-500 text-sm leading-relaxed">Get some insirations from 1800+ skills</p>
        <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Categories<BiArrowBack className="rotate-180" /></Link>
        <TalentByCategoryList />
      </div>
      <div className="bg-purple-100/30 px-4 py-8 flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Latest Jobs</h2>
        <p className="text-slate-500 text-sm leading-relaxed">Know your worth and find the job that qualify your life</p>
        <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Jobs<BiArrowBack className="rotate-180" /></Link>
        <LatestJobsList />
      </div>
      <div className="px-4 flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">A whole world of talent freelancers ready to ship the best content</h2>
        <div>
          <WhyUsProofList />
        </div>
      </div>
      <div className="px-4 flex flex-col gap-3 mt-4">
        <h2 className="text-2xl font-semibold text-slate-900">Highest Rated Freelancers</h2>
        <p className="text-slate-500 text-sm leading-relaxed">Work with the best freelancers for the best quality</p>
        <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Freelancers<BiArrowBack className="rotate-180" /></Link>
        <HighestRatedFreelancersList />
      </div>
      <div className="px-4 flex flex-col gap-3 py-8 bg-purple-100/30">
        <h2 className="text-2xl font-semibold text-slate-900">Find the talent needed to get your business growing.</h2>
        <p className="text-slate-500 text-sm leading-relaxed">Advertise your jobs to millions of monthly users and search 15.8 million CVs</p>
        <Link to={"/"} className="text-white bg-purple-800 font-semibold flex items-center gap-2 self-start px-3 py-2 rounded">Get Started<BiArrowBack className="rotate-[135deg]" /></Link>
      </div>
    </div>
  )
}

export default Home;
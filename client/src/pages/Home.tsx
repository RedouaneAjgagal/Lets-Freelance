import { Link } from "react-router-dom";
import { TrustedBy, TrendingServicesList, TalentByCategoryList, LatestJobsList, HighestRatedFreelancersList, WhyUsProofList } from "../components/home";
import { BiArrowBack } from "react-icons/bi";
import { PrimaryLink } from "../layouts/brand";

const Home = () => {


  return (
    <div className="flex flex-col gap-4">
      <header className="px-4 py-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold text-purple-800 leading-[1.3]">Hire Experts & Get Your Job Done.</h1>
          <p className="text-slate-500 leading-[1.6]">Work with talented people at the most affordable price to get the most out of your time and cost.</p>
          <PrimaryLink to="/auth/register" justifyConent="start" fullWith={false} x="lg" y="md">
            Get started
            <BiArrowBack className="rotate-[135deg]" />
          </PrimaryLink>
          <div className="flex flex-col gap-4">
            <p className="text-slate-400 font-medium"><span>Trusted by</span></p>
            <TrustedBy />
          </div>
        </div>
      </header>
      <main className="flex flex-col gap-10">
        <section className="px-4 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Trending Services</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Most viewed and all-time top-selling services</p>
          <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Services <BiArrowBack className="rotate-180" /></Link>
          <TrendingServicesList />
        </section>
        <section className="px-4 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Browse talent by category</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Get some insirations from 1800+ skills</p>
          <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Categories<BiArrowBack className="rotate-180" /></Link>
          <TalentByCategoryList />
        </section>
        <section className="bg-purple-100/30 px-4 py-8 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Latest Jobs</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Know your worth and find the job that qualify your life</p>
          <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Jobs<BiArrowBack className="rotate-180" /></Link>
          <LatestJobsList />
        </section>
        <article className="px-4 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">A whole world of talent freelancers ready to ship the best content</h2>
          <div>
            <WhyUsProofList />
          </div>
        </article>
        <section className="px-4 flex flex-col gap-3 mt-4">
          <h2 className="text-2xl font-semibold text-slate-900">Highest Rated Freelancers</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Work with the best freelancers for the best quality</p>
          <Link to={"/"} className="text-black font-semibold flex items-center gap-2 self-start">All Freelancers<BiArrowBack className="rotate-180" /></Link>
          <HighestRatedFreelancersList />
        </section>
        <article className="px-4 flex flex-col gap-3 py-12 bg-purple-100/30">
          <h2 className="text-2xl font-semibold text-slate-900">Find the talent needed to get your business growing.</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Advertise your jobs to millions of monthly users and search 15.8 million CVs</p>
          <PrimaryLink to="/auth/register" justifyConent="start" fullWith={false} x="lg" y="md">
            Get started
            <BiArrowBack className="rotate-[135deg]" />
          </PrimaryLink>
        </article>
      </main>
    </div>
  )
}

export default Home;
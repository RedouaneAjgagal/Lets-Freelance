import { AdvertisementNavbar } from "../../features/advertisement"


const AdvertisementHomePage = () => {
    return (
        <main className="flex flex-col gap-4 pb-8">
            <h1 className="p-4 text-3xl font-semibold text-purple-800 leading-relaxed">Advertisements</h1>
            <AdvertisementNavbar />
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">About:</h2>
                <p className="text-slate-600">Promote your services now! By advertising, you can increase the visibility of your offerings and get them listed among the top search results.</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">How it works:</h2>
                <p className="text-slate-600">All your services are eligible for promotion. Promoted services will appear with a <em className="text-black">"Sponsored"</em> label for increased visibility.</p>
                <p className="text-slate-600">You can either create <em className="text-black">"Fixed budget campaign"</em> or <em className="text-black">"Daily budget campaign"</em></p>
                <div>
                    <h3 className="font-medium mt-3 inline-flex">Fixed budget campaign:</h3>
                    <p className="inline text-slate-600"> Set a maximum budget for your campaign. Once the budget is reached, the campaign will automatically pause, ensuring you stay within your spending limit.</p>
                </div>
                <div>
                    <h3 className="font-medium mt-3 inline-flex">Daily budget campaign:</h3>
                    <p className="inline text-slate-600"> Set a daily budget for your campaign. Each day, the campaign will spend up to the maximum you set, ensuring efficient use of your funds.</p>
                </div>
                <p className="text-slate-600 mt-4">You also create your campaign based on the date <em className="text-black">"Starting date"</em> and <em className="text-black">"Ending date"</em>
                </p>
                <div>
                    <h3 className="font-medium mt-3 inline-flex">A Starting date:</h3>
                    <p className="inline text-slate-600"> The day where you want the campaign to start running.</p>
                </div>
                <div>
                    <h3 className="font-medium mt-3 inline-flex">An Ending date:</h3>
                    <p className="inline text-slate-600"> The day where you want the campaign to stop running.</p>
                </div>
                <p className="text-slate-600 mt-4">Each campaign has its own ad sets, each ad set can either be <em className="text-black">"cpc"</em> or <em className="text-black">"cpm"</em>
                </p>
                <div>
                    <h3 className="font-medium mt-3 inline-flex">What is cpc:</h3>
                    <p className="inline text-slate-600"> CPC (Cost-Per-Click) billing means you only pay when someone clicks on your ad. Each click on your service ad deducts from your campaign budget.</p>
                </div>
                <div>
                    <h3 className="font-medium mt-3 inline-flex">What is cpm:</h3>
                    <p className="inline text-slate-600"> CPM (Cost-Per-Thousand-Impressions) billing means you pay each time your ad is shown a certain number of times (1,000 impressions).</p>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Payment methods</h2>
                <p className="text-slate-600">Unlock advertising for your services with a secure credit card payment method.</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">How to pay:</h2>
                <p className="text-slate-600">After setting your payment method, you'll be automatically charged every 3 days.</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Unpaid campaign:</h2>
                <p className="text-slate-600">If automatic charges fail due to unpaid invoices (e.g. no funds) then all your campaigns are going to be paused and you wont be able promote any of your services.</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Unpaid invoices:</h2>
                <p className="text-slate-600">Update your payment method, resolve any outstanding invoices, if all invoices are paid, you will be able to promote your services again.</p>
            </div>
        </main>
    )
}

export default AdvertisementHomePage
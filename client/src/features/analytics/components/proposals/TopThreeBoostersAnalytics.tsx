import { ProposalsAnalyticsTopThreeBoostersType } from "../../services/proposalsAnalytics";
import Loading from "../../../../components/Loading";

type TopThreeBoostersAnalytics = {
    title: string;
    isLoading: boolean;
    topThreeBoosters: ProposalsAnalyticsTopThreeBoostersType[] | undefined;
}

const TopThreeBoostersAnalytics = (props: React.PropsWithoutRef<TopThreeBoostersAnalytics>) => {

    const boosters = props.topThreeBoosters?.map((value, index) => (
        <li key={value._id} className="flex justify-between px-4 border-b last:border-b-0 py-3 first:pt-0 last:pb-0">
            <div className="flex items-center">
                <span className="font-medium text-slate-800">#{index + 1}</span>
            </div>
            <div className="flex items-start gap-1">
                <span className="font-medium text-lg">{value.connects}</span>
                <span className="text-slate-600 text-sm">connects</span>
            </div>
        </li>
    ))

    return (
        <div className="bg-white shadow-sm rounded mt-8 pb-4">
            <div className="p-4 pt-4 flex flex-wrap gap-y-2 gap-x-3 justify-between border-b mb-4">
                <h2 className="font-semibold text-xl">{props.title}</h2>
            </div>
            {props.isLoading
                ? <Loading />
                : boosters!.length
                    ? <ul className="flex flex-col">
                        {boosters}
                    </ul>
                    : <span className="p-4 mb-4">Empty..</span>
            }
        </div>
    )
}

export default TopThreeBoostersAnalytics
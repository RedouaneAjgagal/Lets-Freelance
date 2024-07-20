import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { IoPeopleCircleSharp } from "react-icons/io5";

type TalentTypes = "any-talent" | "single-freelancer" | "independent-freelancers" | "agency-freelancers";

type FreelancerTypeFilterProps = {
    onChange: (talentType: TalentTypes) => void;
    talentType?: TalentTypes
}

const FreelancerTypeFilter = (props: React.PropsWithoutRef<FreelancerTypeFilterProps>) => {
    const talentTypes = [
        {
            label: "Any Talent",
            value: "any-talent"
        },
        {
            label: "Single Freelancer",
            value: "single-freelancer",
            icon: IoIosPerson
        },
        {
            label: "Independent Freelancers",
            value: "independent-freelancers",
            icon: IoIosPeople
        },
        {
            label: "Agency Freelancers",
            value: "agency-freelancers",
            icon: IoPeopleCircleSharp
        }
    ];

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Talent Type</h4>
            <div className="flex flex-col gap-2">
                {talentTypes.map(talentType => (
                    <label key={talentType.value} className="flex gap-2">
                        <input type="radio" value={talentType.value} className="accent-purple-600" onChange={() => props.onChange(talentType.value as TalentTypes)} checked={talentType.value === "any-talent" ? !props.talentType : props.talentType === talentType.value} />
                        {talentType.icon ?
                            <div className="flex items-center gap-1">
                                <span className="bg-purple-500 flex justify-center items-center p-[.2rem] rounded-md text-white">
                                    <talentType.icon />
                                </span>
                            </div>
                            : null
                        }
                        {talentType.label}
                    </label>
                )
                )}
            </div>
        </div>
    )
}

export default FreelancerTypeFilter
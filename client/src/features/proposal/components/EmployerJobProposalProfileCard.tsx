import { BsFillLightningChargeFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import InfoModal from '../../../layouts/brand/InfoModal'
import formatProfileName from '../../../utils/formatProfileName';

type EmployerJobProposalProfileCardProps = {
    profileId: string;
    name: string;
    avatar: string;
    jobTitle?: string;
    isBoostedProposal: boolean;
}

const EmployerJobProposalProfileCard = (props: React.PropsWithoutRef<EmployerJobProposalProfileCardProps>) => {
    const profileName = formatProfileName(props.name);

    return (
        <div className="flex items-center gap-3">
            <div className="min-h-full max-w-full">
                <img className="rounded-full w-14 h-14 object-cover" src={props.avatar} alt="freelancer avatar" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex flex-col">
                    <Link to={`/profiles/${props.profileId}`} className="text-purple-700 font-medium self-start" >{profileName}</Link>
                    {props.isBoostedProposal ?
                        <div className="text-sm flex flex-wrap gap-1">
                            <span className="text-slate-600">Highly interested</span>
                            <div className="relative group">
                                <BsFillLightningChargeFill className="text-orange-500" />
                                <InfoModal width="sm" position="center" content="This freelancer spent more on this job to get noticed." />
                            </div>
                        </div>
                        : null
                    }
                </div>
                {props.jobTitle ?
                    <div>
                        <span className="font-medium text-[.95rem]">{props.jobTitle}</span>
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

export default EmployerJobProposalProfileCard
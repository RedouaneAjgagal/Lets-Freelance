import { TbStarFilled } from 'react-icons/tb';
import formatDate from '../utils/formatDate';
import formatProfileName from '../utils/formatProfileName';
import { Link } from 'react-router-dom';

type ReviewProps = {
    profile: {
        _id: string;
        name: string;
        avatar: string;
    };
    rating: number;
    description: string;
    createdAt: string;
}

const Review = (props: React.PropsWithoutRef<ReviewProps>) => {
    const createdAt = formatDate(props.createdAt);

    const employerName = formatProfileName(props.profile.name);

    return (
        <li className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <div>
                    <img src={props.profile.avatar} alt="employer's avatar" className="w-11 h-11 object-cover rounded-full" />
                </div>
                <div>
                    <Link to={`/profiles/${props.profile._id}`} className="font-semibold">{employerName}</Link>
                    <div className="flex items-center flex-wrap gap-x-1">
                        <TbStarFilled className="text-purple-600 text-sm" />
                        <strong className="flex font-medium">
                            {props.rating.toFixed(2)}
                        </strong>
                        <small className="text-slate-500">
                            {createdAt}
                        </small>
                    </div>
                </div>
            </div>
            <p className="text-slate-700 text-[.95rem]">
                {props.description}
            </p>
        </li>
    )
}

export default Review
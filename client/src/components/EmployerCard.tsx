import FavoriteHeartButton from './FavoriteHeartButton'
import { AiFillStar } from 'react-icons/ai'
import NavigatorLink from './NavigatorLink'
import useFavoritesMutation from '../features/favorites/hooks/useFavoritesMutation';
import formatProfileName from '../utils/formatProfileName';
import { FavoriteEmployerType } from '../features/favorites/services/getFavorites';

type Category = "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";

type Rating = {
    avgRate?: number | undefined;
    numOfReviews: number;
};

type EmployerCardProps = {
    employer: {
        _id: string;
        name: string;
        avatar: string;
        country: string | undefined;
        userAs?: "employer";
        category: Category;
        rating: Rating;
        isFavorite: 0 | 1;
        roles: {
            employer: {
                employees: number;
                totalJobPosted: number;
            }
        }
    }
}

const EmployerCard = (props: React.PropsWithoutRef<EmployerCardProps>) => {
    const favoritesMutation = useFavoritesMutation({
        event: "profile",
        target: props.employer._id
    });

    const favoriteEmployerToggle = () => {
        favoritesMutation.mutate({
            event: "profile",
            target: props.employer._id
        });
    }

    const employerName = formatProfileName(props.employer.name);

    const details: {
        category: FavoriteEmployerType["profile"]["category"];
        postedJobs: string;
        employees: string;
        country?: string;
    } = {
        category: props.employer.category,
        postedJobs: `${props.employer.roles.employer.totalJobPosted} job posted`,
        employees: props.employer.roles.employer.employees === 0 ? "Self employed" : `${props.employer.roles.employer.employees} employees`
    }

    if (props.employer.country) {
        details.country = props.employer.country;
    }

    const detail = Object.values(details).join(" - ");

    return (
        <article className="p-4 border rounded flex flex-col gap-3 relative h-full sm:p-6">
            <FavoriteHeartButton fillHeart={props.employer.isFavorite === 1 ? true : false} onClick={favoriteEmployerToggle} />
            <div className="flex items-center gap-3">
                <div>
                    <img src={props.employer.avatar} alt="employer avatar" className="w-14 h-14 rounded-full object-cover" />
                </div>
                <h3 className='text-lg font-medium'>{employerName}</h3>
            </div>
            {props.employer.rating.avgRate ?
                <div className="flex  items-center gap-2">
                    <AiFillStar className="text-yellow-500" />
                    <p className="flex items-center gap-1 font-medium">
                        {props.employer.rating.avgRate.toFixed(1)}
                        <span className="text-slate-500 font-normal text-sm">
                            ({props.employer.rating.numOfReviews} Reviews)
                        </span>
                    </p>
                </div>
                :
                null
            }
            <div>
                <p className="text-gray-500 font-medium text-sm">{detail}</p>
            </div>
            <div className="h-full flex items-end">
                <div className='w-full'>
                    <NavigatorLink to={`/profiles/${props.employer._id}`}>View Profile</NavigatorLink>
                </div>
            </div>
        </article>
    )
}

export default EmployerCard
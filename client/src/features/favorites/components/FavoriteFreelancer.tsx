import FreelancerCard from "../../../components/FreelancerCard";
import { FavoriteFreelancerType } from "../services/getFavorites";

type FavoriteFreelancerProps = {
    freelancer: FavoriteFreelancerType;
}

const FavoriteFreelancer = (props: React.PropsWithoutRef<FavoriteFreelancerProps>) => {
    return (
        <li>
            <FreelancerCard freelancerInfo={{ ...props.freelancer.profile, isFavourite: 1 }} />
        </li>
    )
}

export default FavoriteFreelancer
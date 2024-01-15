import FreelancerCard from "../../../components/FreelancerCard";
import { FavoriteFreelancerType } from "../services/getFavorites";

type FavoriteFreelancerProps = {
    freelancer: FavoriteFreelancerType;
}

const FavoriteFreelancer = (props: React.PropsWithoutRef<FavoriteFreelancerProps>) => {
    return (
        <section>
            <FreelancerCard freelancerInfo={{ ...props.freelancer.profile, isFavourite: 1 }} />
        </section>
    )
}

export default FavoriteFreelancer
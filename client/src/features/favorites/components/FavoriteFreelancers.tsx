import { FavoriteFreelancerType } from "../services/getFavorites"
import FavoriteFreelancer from "./FavoriteFreelancer";

type FavoriteFreelancersProps = {
  freelancers: FavoriteFreelancerType[];
}

const FavoriteFreelancers = (props: React.PropsWithoutRef<FavoriteFreelancersProps>) => {
  return (
    <ul className="flex flex-col gap-6 p-4">
      {props.freelancers.length ?
        props.freelancers.map(freelancer => <FavoriteFreelancer key={freelancer.profile._id} freelancer={freelancer} />)
        :
        <h2>You don't have any favorite freelancers</h2>
      }

    </ul>
  )
}

export default FavoriteFreelancers
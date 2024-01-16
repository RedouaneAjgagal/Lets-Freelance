import { FavoriteEmployerType } from "../services/getFavorites";
import FavoriteEmployer from "./FavoriteEmployer";

type FavoriteEmployersProps = {
  employers: FavoriteEmployerType[];
}

const FavoriteEmployers = (props: React.PropsWithoutRef<FavoriteEmployersProps>) => {
  return (
    <ul className="flex flex-col gap-6 p-4">
      {props.employers.length ?
        props.employers.map(employer => <FavoriteEmployer key={employer._id} employer={employer.profile} />)
        :
        <h2>You don't have any favorite employers</h2>
      }
    </ul>
  )
}

export default FavoriteEmployers
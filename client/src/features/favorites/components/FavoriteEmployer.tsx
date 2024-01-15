import { FavoriteEmployerType } from "../services/getFavorites"
import EmployerCard from "../../../components/EmployerCard";

type FavoriteEmployerProps = {
    employer: FavoriteEmployerType["profile"];
}

const FavoriteEmployer = (props: React.PropsWithoutRef<FavoriteEmployerProps>) => {

    return (
        <li>
            <EmployerCard employer={{ ...props.employer, isFavorite: 1 }} />
        </li>
    )
}

export default FavoriteEmployer
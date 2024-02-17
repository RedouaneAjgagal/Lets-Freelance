import { FavoriteJobType } from "../services/getFavorites"
import useFavoritesMutation from "../hooks/useFavoritesMutation";
import { JobCard } from "../../job";

type FavoriteJobProps = {
  job: FavoriteJobType["job"];
}

const FavoriteJob = (props: React.PropsWithoutRef<FavoriteJobProps>) => {
  const favoriteMutation = useFavoritesMutation("job");

  const favoriteJobToggle = () => {
    favoriteMutation.mutate({
      event: "job",
      target: props.job._id
    });
  }

  return (
    <JobCard isFavorite onFavorite={favoriteJobToggle} job={props.job} />
  )
}

export default FavoriteJob
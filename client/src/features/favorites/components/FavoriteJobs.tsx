import { FavoriteJobType } from "../services/getFavorites";
import FavoriteJob from "./FavoriteJob";

type FavoriteJobsProps = {
  jobs: FavoriteJobType[];
}

const FavoriteJobs = (props: React.PropsWithoutRef<FavoriteJobsProps>) => {
  return (
    <section>
      {props.jobs.map(data => <FavoriteJob key={data.job._id} job={data.job} />)}
    </section>
  )
}

export default FavoriteJobs
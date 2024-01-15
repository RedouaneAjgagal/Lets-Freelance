import { FavoriteJobType } from "../services/getFavorites";
import FavoriteJob from "./FavoriteJob";

type FavoriteJobsProps = {
  jobs: FavoriteJobType[];
}

const FavoriteJobs = (props: React.PropsWithoutRef<FavoriteJobsProps>) => {
  return (
    <section>
      {props.jobs.length ?
        props.jobs.map(data => <FavoriteJob key={data.job._id} job={data.job} />)
        :
        <h2>You don't have any favorite jobs</h2>
      }
    </section>
  )
}

export default FavoriteJobs
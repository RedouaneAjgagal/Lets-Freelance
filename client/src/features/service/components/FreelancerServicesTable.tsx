import { FreelancerServicesType } from "../services/getFreelancerServices";
import FreelancerServiceTable from "./FreelancerServiceTable";

type FreelancerServicesTableProps = {
  services: FreelancerServicesType;
};

const FreelancerServicesTable = (props: React.PropsWithoutRef<FreelancerServicesTableProps>) => {

  return (
    <section className='bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2'>
      {
        props.services.length ?
          <table className="text-left w-full">
            <thead className="">
              <tr className="">
                <th className="min-w-[14rem] p-2 pb-4">Title</th>
                <th className="min-w-[12rem] p-2 pb-4">In Queue</th>
                <th className="min-w-[12rem] p-2 pb-4">Total Revenue</th>
                <th className="min-w-[12rem] p-2 pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.services.map(service => <FreelancerServiceTable service={service} key={service._id} />)}
            </tbody>
          </table>
          :
          <>
            <h2 className="text-xl font-medium">Empty..</h2>
            <p className="text-slate-500">You haven't posted any service yet.</p>
          </>
      }
    </section>
  )
}

export default FreelancerServicesTable
import { FreelancerServicesType } from "../services/getFreelancerServices";
import FreelancerServiceTable from "./FreelancerServiceTable";
import TableHead from "../../../components/TableHead";

type FreelancerServicesTableProps = {
  services: FreelancerServicesType;
};


const FreelancerServicesTable = (props: React.PropsWithoutRef<FreelancerServicesTableProps>) => {

  const tableHeads = ["Title", "In Queue", "Total Revenue", "Actions"];

  return (
    <section className='bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2'>
      {
        props.services.length ?
          <table className="text-left w-full">
            <TableHead tableHeads={tableHeads} />
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
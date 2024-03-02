import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../../../layouts/brand/ActionButton";
import { EmployerJobType } from "../service/getEmployerJobs";
import { TbStars, TbCalendar } from "react-icons/tb";
import { useState } from "react";
import DeleteJobModal from "../modals/DeleteJobModal";

type EmployerJobTableProps = {
  job: EmployerJobType;
  sectionRef: React.RefObject<HTMLSelectElement>;
}

const EmployerJobTable = (props: React.PropsWithoutRef<EmployerJobTableProps>) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const proposalPluralize = props.job.proposals === 1 ? "" : "s";

  const experienceLevel = `${props.job.experienceLevel.slice(0, 1).toUpperCase()}${props.job.experienceLevel.slice(1).toLowerCase()}`;

  const postedAt = new Date(props.job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });

  const price = props.job.priceType === "fixed" ? `$${props.job.price.max.toFixed(0)}` : `$${props.job.price.min.toFixed(0)} - $${props.job.price.max.toFixed(0)}`;

  const formatedPriceTypes = {
    fixed: "fixed",
    hourly: "hr"
  } as const;

  const priceType = formatedPriceTypes[props.job.priceType];

  const statusTypes = {
    open: {
      value: "Open",
      stype: "bg-blue-200/80 text-blue-600"
    },
    closed: {
      value: "Closed",
      stype: "bg-red-200/80 text-red-600"
    }
  } as const;

  const status = statusTypes[props.job.status];

  const viewJobHanlder = () => {
    navigate(`/jobs/${props.job._id}`);
  }

  const updateJobHanlder = () => {
    navigate(`/profile/employer/jobs/${props.job._id}/edit`);
  }

  const deleteJobHanlder = () => {
    setIsDeleteModalOpen(true);
  }

  return (
    <>
      {isDeleteModalOpen ?
        <DeleteJobModal sectionRef={props.sectionRef} closeModalhandler={() => setIsDeleteModalOpen(false)} jobId={props.job._id} />
        : null
      }
      <tr className="border-t">
        <td className="p-2 py-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-[1.1rem]">{props.job.title}</h3>
            <div>
              <Link to={`/profile/employer/proposals/${props.job._id}`} className="text-sm  text-slate-600 underline">{`${props.job.proposals} Proposal${proposalPluralize}`}</Link>
            </div>
            <span className="text-sm text-slate-600 flex items-center gap-1">
              <TbStars size={18} />
              {experienceLevel}
            </span>
            <span className="text-sm text-slate-600 flex items-center gap-1">
              <TbCalendar size={18} />
              {postedAt}
            </span>
          </div>
        </td>
        <td className="p-2 py-4">
          <div className="flex items-start gap-1 flex-wrap">
            <span className="font-medium text-lg">
              {price}
            </span>
            <span className="text-slate-600 text-sm">
              {priceType}
            </span>
          </div>
        </td>
        <td className="p-2 py-4">
          <div className={`${status.stype} p-2 rounded inline-flex`}>
            <span>{status.value}</span>
          </div>
        </td>
        <td className="p-2 py-4">
          <div className="flex gap-2">
            <ActionButton type="view" onClick={viewJobHanlder} minimized />
            <ActionButton type="edit" onClick={updateJobHanlder} minimized />
            <ActionButton type="delete" onClick={deleteJobHanlder} minimized />
          </div>
        </td>
      </tr>
    </>
  )
}

export default EmployerJobTable
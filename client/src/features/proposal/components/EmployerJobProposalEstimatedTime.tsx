import { TbClock } from "react-icons/tb";
import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals"

type EmployerJobProposalEstimatedTimeProps = {
  estimatedTime: GetEmployerJobProposalType["estimatedTime"];
}

const EmployerJobProposalEstimatedTime = (props: React.PropsWithoutRef<EmployerJobProposalEstimatedTimeProps>) => {

  const estimatedDurationPluralize = props.estimatedTime.timeValue === 1 ? "" : "s";

  const estimatedDurationContent = `Estimated duration: ${props.estimatedTime.timeValue} ${props.estimatedTime.timeType.slice(0, -1)}${estimatedDurationPluralize}`;

  return (
    <div className="flex items-center justify-center gap-1 text-slate-800">
      <TbClock size={20} />
      <strong className="font-medium">{estimatedDurationContent}</strong>
    </div>
  )
}

export default EmployerJobProposalEstimatedTime
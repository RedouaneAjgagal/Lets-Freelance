import formatPostedTime from "../../../utils/formatPostedTime";
import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals";
import { FaRegEnvelope } from "react-icons/fa";

type EmployerJobProposalPostedAtProps = {
    createdAt: GetEmployerJobProposalType["createdAt"];
}

const EmployerJobProposalPostedAt = (props: React.PropsWithoutRef<EmployerJobProposalPostedAtProps>) => {

    const { diff, pluralize, unit } = formatPostedTime({
        postedAt: props.createdAt
    });

    const postedAt = `Sent ${diff} ${unit}${pluralize} ago`;

    return (
        <div className=" flex items-center gap-2 text-slate-600">
            <FaRegEnvelope />
            <small className="">{postedAt}</small>
        </div>
    )
}

export default EmployerJobProposalPostedAt
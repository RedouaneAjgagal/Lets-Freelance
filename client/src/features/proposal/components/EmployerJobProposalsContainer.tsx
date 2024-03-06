import { useEffect, useState } from "react";
import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals"
import EmployerJobProposalsNav from "./EmployerJobProposalsNav";
import EmployerJobProposalsList from "./EmployerJobProposalsList";
import notFoundImage from "/not_found.png";

type EmployerJobProposalsContainerProps = {
    proposals: GetEmployerJobProposalType[];
}

const EmployerJobProposalsContainer = (props: React.PropsWithoutRef<EmployerJobProposalsContainerProps>) => {
    const [selectedFilter, setSelectedFilter] = useState({
        name: "All",
        value: "all"
    });

    const [proposals, setProposals] = useState(props.proposals);

    const filterHandler = ({ name, value }: { name: string; value: string }) => {
        setSelectedFilter({ name, value });

        setProposals(() => {
            if (value === "all") {
                return props.proposals
            }

            return props.proposals.filter(proposal => proposal.status === value);
        });
    }

    useEffect(() => {
        setProposals(props.proposals);
    }, [props.proposals]);

    return (
        <div>
            <EmployerJobProposalsNav onSelect={filterHandler} selectedName={selectedFilter.name} />
            {proposals.length ?
                <EmployerJobProposalsList proposals={proposals} />
                : <section className="flex flex-col gap-4 p-4 text-center items-center">
                    <img src={notFoundImage} alt="search image" className="w-32 h-32" />
                    <h2>You dont have any "{selectedFilter.name}" proposals in this job</h2>
                </section>
            }
        </div>
    )
}

export default EmployerJobProposalsContainer
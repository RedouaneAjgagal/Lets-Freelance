import notFoundImage from "/not_found.png";
import Loading from "../../components/Loading";
import { EmployerJobProposalsContainer, useEmployerJobProposalsQuery } from "../../features/proposal"


const EmployerJobProposals = () => {
    const employerJobProposals = useEmployerJobProposalsQuery();

    return (
        <main className="py-4 flex flex-col lg:gap-6">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed mx-4">Job proposals</h1>
            {employerJobProposals.isLoading
                ? <div className="p-4">
                    <Loading type="cards" display="column" numOfCards={4} />
                </div>
                : employerJobProposals.data!.length ?
                    <EmployerJobProposalsContainer proposals={employerJobProposals.data!} />
                    : <section className="flex flex-col gap-4 p-4 text-center items-center">
                        <img src={notFoundImage} alt="search image" className="w-32 h-32" />
                        <h2>This job has no proposals yet..</h2>
                    </section>
            }
        </main>
    )
}

export default EmployerJobProposals
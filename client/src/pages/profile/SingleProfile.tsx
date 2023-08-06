import SingleProfileFreelancer from "../../features/profile/components/SingleProfileFreelancer"

const targetAs: "freelancer" | "employer" = "freelancer";

const SingleProfile = () => {
    return (
        <main className="grid gap-4">
            {targetAs === "freelancer" ?
                <SingleProfileFreelancer />
                :
                <h1>Employer</h1>
            }
        </main>
    )
}

export default SingleProfile
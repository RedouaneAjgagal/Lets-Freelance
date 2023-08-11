import SingleProfileEmployer from "../../features/profile/components/SingleProfileEmployer";
import SingleProfileFreelancer from "../../features/profile/components/SingleProfileFreelancer"

const targetAs: "freelancer" | "employer" = "freelancer";

const SingleProfile = () => {
    return (
        <main className="grid gap-4">
            {targetAs === "freelancer" ?
                <SingleProfileFreelancer />
                :
                <SingleProfileEmployer />
            }
        </main>
    )
}

export default SingleProfile
import FreelancerTypeFilter from '../../../components/FreelancerTypeFilter'
import useCustomSearchParams from '../../../hooks/useCustomSearchParams'
import { isValidTelentType } from '../validators/searchTalentsValidators';

type TalentTypes = "any-talent" | "single-freelancer" | "independent-freelancers" | "agency-freelancers";

const SearchTalentType = () => {
    const customSearchParams = useCustomSearchParams();

    const searchedTalentType = customSearchParams.getSearchParams({
        key: "talent_type"
    });

    const setTalentTypeHandler = (talentType: "any-talent" | "single-freelancer" | "single-freelancer" | "independent-freelancers" | "agency-freelancers") => {
        customSearchParams.setSearchParams({
            key: "talent_type",
            value: talentType === "any-talent" ? "" : talentType
        });
    }

    const validTalentType = isValidTelentType(searchedTalentType || "");

    const talentType = validTalentType ? searchedTalentType as TalentTypes : undefined;

    return (
        <FreelancerTypeFilter onChange={setTalentTypeHandler} talentType={talentType} />
    )
}

export default SearchTalentType
import NoMatchErrorMessage from '../../../components/NoMatchErrorMessage';
import { SearchedTalentType } from '../services/getFreelancers'
import SearchedFreelancerCard from './SearchedFreelancerCard'

type SearchedFreelancersProps = {
    telents: SearchedTalentType[];
}

const SearchedFreelancers = (props: React.PropsWithoutRef<SearchedFreelancersProps>) => {

    return (
        <ul>
            {props.telents.length ?
                props.telents.map(talent => <SearchedFreelancerCard key={talent._id} telent={talent} />)
                : <NoMatchErrorMessage />
            }
        </ul>
    )
}

export default SearchedFreelancers
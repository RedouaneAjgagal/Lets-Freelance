import { BiArrowBack, BiX } from "react-icons/bi";
import Overlay from "../../../layouts/Overlay";
import CategoryFilter from "../components/CategoryFilter";
import { PrimaryButton } from "../../../layouts/brand";
import DeliveryTimeFilter from "../components/DeliveryTimeFilter";
import BudgetFilter from "../components/BudgetFilter";

type FilterServicesModalProps = {
    isModalOpen: boolean;
    onCloseModal: () => void;
}

const FilterServicesModal = (props: React.PropsWithoutRef<FilterServicesModalProps>) => {

    const filterServicesHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formadata = new FormData(e.currentTarget);
        const categoryValue = formadata.get("category");
        console.log({
            category: categoryValue
        });
    }


    return (
        <section>
            {props.isModalOpen ?
                <Overlay onClose={props.onCloseModal} />
                :
                null
            }
            <div className={`bg-white  h-screen fixed w-full flex flex-col gap-6 p-4 transition-all text-slate-600 font-medium bottom-0 z-[90] overflow-y-scroll ${props.isModalOpen ? "left-0" : "-left-full"}`}>
                <div className="flex items-center justify-between text-slate-700 pb-4 border-b">
                    <h3>All Filters</h3>
                    <button onClick={props.onCloseModal} className="bg-purple-100/70 rounded p-1">
                        <BiX size={24} />
                    </button>
                </div>
                <form onSubmit={filterServicesHandler} className="flex flex-col gap-8">
                    <CategoryFilter SIZE={5} />
                    <DeliveryTimeFilter />
                    <BudgetFilter from={5} to={1000} step={5} />
                    <PrimaryButton disabled={false} fullWith justifyConent="center" style="outline" type="submit" x="md" y="md">
                        Filter Services
                        <BiArrowBack className="rotate-[135deg]" />
                    </PrimaryButton>
                </form>
            </div>
        </section>
    )
}

export default FilterServicesModal
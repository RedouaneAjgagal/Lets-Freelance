import { BiArrowBack, BiX } from "react-icons/bi";
import Overlay from "../../../layouts/Overlay";
import { PrimaryButton } from "../../../layouts/brand";
import DeliveryTimeFilter from "../components/DeliveryTimeFilter";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";
import BadgeFilter from "../../../components/BadgeFilter";
import SearchServicesRatingFilter from "../components/SearchServicesRatingFilter";
import SearchServicesBudgetFilter from "../components/SearchServicesBudgetFilter";
import SearchServicesCategoryFilter from "../components/SearchServicesCategoryFilter";
import SearchServicesEnglishLevelFilter from "../components/SearchServicesEnglishLevelFilter";
import SearchServicesLocationFilter from "../components/SearchServicesLocationFilter";

type FilterServicesModalProps = {
    isModalOpen: boolean;
    onCloseModal: () => void;
}

const FilterServicesModal = (props: React.PropsWithoutRef<FilterServicesModalProps>) => {
    const { badge } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const modalRef = useRef<HTMLDivElement>(null);

    const filterServicesHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.scroll({ top: 0 });

        // close modal because filters work automatically onClick
        props.onCloseModal();
    }


    const badgeFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const badges = ["any-talent", "top-rated-plus", "top-rated", "rising-talent"] as const;

        const badge = e.currentTarget.value as "any-talent" | "top-rated-plus" | "top-rated" | "rising-talent";

        if (!badges.includes(badge)) {
            return;
        }

        dispatch(filterSearchedServicesAction.filterByBadge(badge));
    }

    useEffect(() => {
        if (props.isModalOpen) {
            modalRef.current!.scrollTop = 0;
        }
    }, [props.isModalOpen]);

    return (
        <section className="relative">
            {props.isModalOpen ?
                <Overlay onClose={props.onCloseModal} />
                :
                null
            }
            <div className={`bg-white  h-screen fixed w-full flex flex-col gap-6 p-4 transition-all text-slate-600 font-medium z-[90] overflow-y-scroll bottom-0 ${props.isModalOpen ? "left-0" : "-left-full"}`} ref={modalRef}>
                <div className="flex items-center justify-between text-slate-700 pb-4 border-b">
                    <h3>All Filters</h3>
                    <button onClick={props.onCloseModal} className="bg-purple-100/70 rounded p-1">
                        <BiX size={24} />
                    </button>
                </div>
                <form onSubmit={filterServicesHandler} className="flex flex-col gap-8">
                    <SearchServicesCategoryFilter SIZE={5} />
                    <DeliveryTimeFilter />
                    <SearchServicesBudgetFilter from={5} to={1000} step={5} />
                    <SearchServicesRatingFilter rates={[4.5, 4, 3]} />
                    <h3 className="text-black text-2xl -mb-3">Talent Details</h3>
                    <SearchServicesEnglishLevelFilter SIZE={4} />
                    <BadgeFilter onSelectBadge={badgeFilterHandler} badge={badge} />
                    <SearchServicesLocationFilter />
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
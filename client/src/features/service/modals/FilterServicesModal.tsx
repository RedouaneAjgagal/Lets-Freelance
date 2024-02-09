import { BiArrowBack, BiX } from "react-icons/bi";
import Overlay from "../../../layouts/Overlay";
import CategoryFilter from "../components/CategoryFilter";
import { PrimaryButton } from "../../../layouts/brand";
import DeliveryTimeFilter from "../components/DeliveryTimeFilter";
import BudgetFilter from "../components/BudgetFilter";
import RatingFilter from "../components/RatingFilter";
import EnglishLevelFilter from "../components/EnglishLevelFilter";
import BadgeFilter from "../components/BadgeFilter";
import CountryFilter from "../components/CountryFilter";
import { useEffect, useRef } from "react";

type FilterServicesModalProps = {
    isModalOpen: boolean;
    onCloseModal: () => void;
}

const FilterServicesModal = (props: React.PropsWithoutRef<FilterServicesModalProps>) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const filterServicesHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.scroll({ top: 0 });

        // close modal because filters work automatically onClick
        props.onCloseModal();
    }

    useEffect(() => {
        if (props.isModalOpen) {
            modalRef.current!.scrollTop = 0;
        }
    }, [props.isModalOpen])

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
                    <CategoryFilter SIZE={5} />
                    <DeliveryTimeFilter />
                    <BudgetFilter from={5} to={1000} step={5} />
                    <RatingFilter rates={[4.5, 4, 3]} />
                    <h3 className="text-black text-2xl -mb-3">Talent Details</h3>
                    <EnglishLevelFilter SIZE={4} />
                    <BadgeFilter />
                    <CountryFilter />
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
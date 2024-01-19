import { TbSortDescending, TbCheck } from 'react-icons/tb'
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { filterByStatusAction } from '../redux/service';

const FilterByStatus = () => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const { filterBy } = useAppSelector(state => state.filterByStatusReducer);

    const statusTypes: {
        value: "inprogress" | "completed" | "canceled" | "all";
        content: string
    }[] = [
            { content: "All", value: "all" },
            { content: "In Progress", value: "inprogress" },
            { content: "Completed", value: "completed" },
            { content: "Canceled", value: "canceled" },
        ];

    const toggleFilterMenu = () => {
        setIsFilterOpen(prev => !prev);
    }

    const filterStatusHandler = (status: "inprogress" | "completed" | "canceled" | "all") => {
        setIsFilterOpen(false);
        dispatch(filterByStatusAction.filterByStatus(status));
    }

    return (
        <div className="flex justify-end relative">
            <button onClick={toggleFilterMenu} className="flex items-center gap-1 text-slate-700 font-medium bg-white p-2 rounded shadow-sm w-44 justify-center">
                Filter by status
                <TbSortDescending size={24} />
            </button>
            {
                isFilterOpen ?
                    <div className="flex flex-col absolute bg-white rounded shadow-lg top-12 w-44">
                        {statusTypes.map(status => (
                            <button key={status.value} value={status.value} onClick={() => filterStatusHandler(status.value)} className={`${filterBy === status.value ? "text-slate-900" : "text-slate-500"} text-left px-4 py-2 font-medium flex items-center gap-1`}>
                                <span className='w-4 h-4'>
                                    {filterBy === status.value ?
                                        <TbCheck />
                                        :
                                        null
                                    }
                                </span>
                                {status.content}
                            </button>
                        ))}
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default FilterByStatus
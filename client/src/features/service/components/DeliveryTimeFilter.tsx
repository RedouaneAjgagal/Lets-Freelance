import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";


type DeliveryTimeType = {
    label: string;
    value: number;
}

const DeliveryTimeFilter = () => {
    const { delivery_time } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const deliveryTimes: DeliveryTimeType[] = [
        {
            label: "Any time",
            value: 0
        },
        {
            label: "Extra fast 24 hour delivery",
            value: 1
        },
        {
            label: "Three days delivery",
            value: 3
        },
        {
            label: "One week delivery",
            value: 7
        },
        {
            label: "Three weeks delivery",
            value: 21
        }
    ];

    const selectDeliveryTimeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const deliveryTime = Number(e.currentTarget.value);
        if (Number.isNaN(deliveryTime) || !Number.isInteger(deliveryTime)) {
            return;
        }

        dispatch(filterSearchedServicesAction.filterByDeliveryTime(deliveryTime));
    }

    const formatedDeliveryTimes = deliveryTimes.map(deliveryTime => {
        return (
            <label key={deliveryTime.label} htmlFor={deliveryTime.label} className="flex gap-2">
                <input type="radio" id={deliveryTime.label} value={deliveryTime.value} name="deliveryTime" className="accent-purple-600" onChange={selectDeliveryTimeHandler} checked={delivery_time ? delivery_time === deliveryTime.value : deliveryTime.value === 0} />
                {deliveryTime.label}
            </label>
        )
    })

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl lg:font-semibold">Delivery Time</h4>
            <div className="flex flex-col gap-2">
                {formatedDeliveryTimes}
            </div>
        </div>
    )
}

export default DeliveryTimeFilter
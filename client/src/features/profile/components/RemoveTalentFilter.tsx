import React from 'react'
import { TbStarFilled, TbX } from 'react-icons/tb'
import useCustomSearchParams from '../../../hooks/useCustomSearchParams';
import { useQueryClient } from '@tanstack/react-query';
import Badge from '../../../layouts/brand/Badge';
import { IoIosPeople, IoIosPerson } from 'react-icons/io';
import { IoPeopleCircleSharp } from 'react-icons/io5';

type RemoveTalentFilterProps = {
    queryKey: string;
    queryValue: number | string;
}

const RemoveTalentFilter = (props: React.PropsWithoutRef<RemoveTalentFilterProps>) => {
    const queryClient = useQueryClient();
    const customSearchParams = useCustomSearchParams();

    let formatedValue: string | number | React.JSX.Element = props.queryValue;

    switch (props.queryKey) {
        case "badge":
            const badgeValue = props.queryValue.toString().split("-").join(" ") as "rising talent" | "top rated" | "top rated plus";
            const badge = <>
                <Badge badge={badgeValue} size="sm" minimized />
                {badgeValue}
            </>;

            formatedValue = badge;
            break;
        case "rating":
            const ratingValue = Number(props.queryValue.toString()).toFixed(1);
            const rating = <>
                <TbStarFilled className="text-yellow-500" />
                {`${ratingValue} ${props.queryValue === 5 ? "" : "& up"}`}
            </>;

            formatedValue = rating;
            break;

        case "revenue":
            const [fromRevenue, toRevenue] = props.queryValue.toString().split(",");
            const revenue = `$${fromRevenue} - $${toRevenue}`;

            formatedValue = revenue;
            break;

        case "category":
            if (props.queryValue === "digital-marketing") {
                formatedValue = "digital marketing";
            } else {
                formatedValue = props.queryValue.toString().split("-").join(" & ");
            }
            break;

        case "english_level":
            formatedValue = `${props.queryValue} english`;
            break;

        case "country":
            formatedValue = `from ${props.queryValue}`;
            break;

        case "talent_type":
            const talentTypeValue = props.queryValue.toString().split("-").join(" ");
            const talentTypesIcons = {
                "single-freelancer": IoIosPerson,
                "independent-freelancers": IoIosPeople,
                "agency-freelancers": IoPeopleCircleSharp
            };

            const TalentTypeIcon = talentTypesIcons[props.queryValue as keyof typeof talentTypesIcons];

            const talentType = <>
                <TalentTypeIcon className="bg-blue-500 flex justify-center items-center rounded-md text-white p-[.1rem]" size={18} />
                {talentTypeValue}
            </>

            formatedValue = talentType;
            break;

        case "hourly_rate":
            const [fromHourlyRate, toHourlyRate] = props.queryValue.toString().split(",");
            formatedValue = `$${fromHourlyRate} - $${toHourlyRate} per hour`;

            if (fromHourlyRate === "1") {
                formatedValue = `less than $${toHourlyRate} per hour`;
            };

            if (toHourlyRate === "999") {
                formatedValue = `more than $${fromHourlyRate} per hour`;
            };

            break;
        default:
            break;
    }

    const removeKeyFilterHandler = () => {
        customSearchParams.setSearchParams({
            key: props.queryKey,
            value: ""
        });

        queryClient.removeQueries({ queryKey: ["telents"] });
    }

    return (
        <button onClick={removeKeyFilterHandler} className="flex items-center gap-1 border border-slate-400 px-3 py-[0.2rem] text-sm rounded-full bg-white shadow-sm capitalize">
            {formatedValue}
            <TbX size={18} />
        </button>
    )
}

export default RemoveTalentFilter
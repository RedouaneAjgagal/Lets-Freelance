import React from 'react'
import CustomIcon from '../../../components/CustomIcon';

type DashboardCardType = {
    cardTitle: string;
    value: number | string;
    iconUrl: string;
}

const DashboardCard = (props: React.PropsWithoutRef<DashboardCardType>) => {
    return (
        <li className='flex items-center justify-between p-4 bg-white rounded shadow-sm'>
            <div>
                <p className='font-medium text-slate-600'>{props.cardTitle}</p>
                <span className='text-slate-800 text-lg font-bold'>{props.value}</span>
            </div>
            <div className='z-0 mb-3'>
                <CustomIcon iconSrc={props.iconUrl} iconAlt='Bought Services' iconSize={10} highlightPosition='bl' />
            </div>
        </li>
    )
}

export default DashboardCard
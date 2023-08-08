import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { TbFileDescription, TbLocation, TbWorldWww } from 'react-icons/tb'
import { BsGenderMale, BsTranslate } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import react from "react";

interface Props {
    freelancerDetails: {
        hourlyRate: number;
        location: string;
        type: string;
        englishLevel: string;
        gender: string;
        portfolio: string;
    }
}

const ContactFreelancerSection = (props: React.PropsWithoutRef<Props>) => {

    const contactFreelancerHandler = () => {
        console.log("contact me");
    }

    const detailsWithoutHourlyRate = {
        "Location": {
            icon: TbLocation,
            value: props.freelancerDetails.location,
            isLink: false
        },
        "Type": {
            icon: TbFileDescription,
            value: props.freelancerDetails.type,
            isLink: false
        },
        "English Level": {
            icon: BsTranslate,
            value: props.freelancerDetails.englishLevel,
            isLink: false
        },
        "Gender": {
            icon: BsGenderMale,
            value: props.freelancerDetails.gender,
            isLink: false
        },
        "Portfolio": {
            icon: TbWorldWww,
            value: props.freelancerDetails.portfolio,
            isLink: true
        },
    }

    return (
        <section className='p-4'>
            <div className='flex flex-col gap-8 border rounded px-4 py-6'>
                <div className='flex items-center gap-2 font-semibold'>
                    <h2 className='text-4xl text-slate-700'>${props.freelancerDetails.hourlyRate}</h2>
                    <span className='text-sm'>/ hr</span>
                </div>
                <div className='flex flex-col gap-4'>
                    {Object.entries(detailsWithoutHourlyRate).map(([key, details], index) =>
                        <react.Fragment key={index}>
                            <div className='flex flex-col gap-4 text-[.95rem]'>
                                <div className='flex items-center justify-between gap-1 flex-wrap'>
                                    <div className='flex items-center gap-2'>
                                        <details.icon size="1.1rem" />
                                        {key}
                                    </div>
                                    {details.isLink ?
                                        <Link to={details.value} target='_blank' rel='noopener' className='font-medium text-purple-500 flex items-center gap-1'>Visit <BiArrowBack className="rotate-[135deg]" /></Link>
                                        :
                                        <h5 className='font-medium'>{details.value}</h5>
                                    }
                                </div>
                            </div>
                            {Object.keys(detailsWithoutHourlyRate).length !== index + 1 ?
                                <hr /> : null
                            }
                        </react.Fragment>
                    )}
                </div>
                <div>
                    <PrimaryButton style='solid' disabled={false} justifyConent='center' type='button' x='md' y='lg' onClick={contactFreelancerHandler} fullWith >
                        Contact Me
                        <BiArrowBack className="rotate-180 text-xl" />
                    </PrimaryButton>
                </div>
            </div>
        </section>
    )
}

export default ContactFreelancerSection
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { TbFileDescription, TbLocation, TbWorldWww, TbCategory } from 'react-icons/tb'
import { BsGenderMale, BsTranslate, BsPeople } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import react from "react";
import { IconType } from 'react-icons'

type FreelancerDetails = {
    contactType: "freelancer";
    details: {
        hourlyRate: number;
        location: string;
        type: string;
        englishLevel: string;
        gender: string;
        portfolio: string;
    };
}

type EmployerDetails = {
    contactType: "employer";
    details: {
        location: string;
        category: string;
        companyName?: string;
        employees: number;
        website?: string;
    }
}

type Content = { icon: IconType; value: string; isLink: boolean }

type Freelancer = {
    "Location": Content;
    "Type": Content;
    "English Level": Content;
    "Gender": Content;
    "Portfolio": Content;
}

type Employer = {
    "Location": Content;
    "Category": Content;
    "Employees": Content;
    "Company"?: Content;
    "Website"?: Content;
}

const ContactSection = (props: React.PropsWithoutRef<FreelancerDetails | EmployerDetails>) => {

    const contactFreelancerHandler = () => {
        console.log("contact me");
    }

    let details = {} as Freelancer | Employer;

    if (props.contactType === "freelancer") {
        details = {
            "Location": {
                icon: TbLocation,
                value: props.details.location,
                isLink: false
            },
            "Type": {
                icon: TbFileDescription,
                value: props.details.type,
                isLink: false
            },
            "English Level": {
                icon: BsTranslate,
                value: props.details.englishLevel,
                isLink: false
            },
            "Gender": {
                icon: BsGenderMale,
                value: props.details.gender,
                isLink: false
            },
            "Portfolio": {
                icon: TbWorldWww,
                value: props.details.portfolio,
                isLink: true
            },
        }
    } else {
        const employees = props.details.employees === 0 ? "Self-employed" : props.details.employees.toString();
        details = {
            "Location": {
                icon: TbLocation,
                value: props.details.location,
                isLink: false
            },
            "Category": {
                icon: TbCategory,
                value: props.details.category,
                isLink: false
            },
            "Employees": {
                icon: BsPeople,
                value: employees,
                isLink: false
            }
        }

        if (props.details.companyName) {
            details["Company"] = {
                icon: TbFileDescription,
                value: props.details.companyName || "",
                isLink: false
            }
        }
        if (props.details.website) {
            details["Website"] = {
                icon: TbWorldWww,
                value: props.details.website,
                isLink: true
            }
        }

    }

    const title = `${props.contactType === "freelancer" ? `$${props.details.hourlyRate}` : `About me`}`;

    return (
        <section className='p-4'>
            <div className='flex flex-col gap-8 border rounded px-4 py-6'>
                <div className='flex items-center gap-2 font-semibold'>
                    <h2 className='text-4xl text-slate-700'>{title}</h2>
                    {props.contactType === "freelancer" ? <span className='text-sm'>/ hr</span> : null}
                </div>
                <div className='flex flex-col gap-4'>
                    {Object.entries(details).map(([key, details], index) =>
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
                            <hr className='last:hidden' />
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

export default ContactSection
import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import Slider from '../../../components/Slider'
import { SwiperSlide } from 'swiper/react'
import { ServiceType } from '../services/getSingleProfileInfo'
import Service from './Service'

interface Props {
    profile: {
        _id: string;
        name: string;
        avatar: string;
    };
    services: ServiceType[];
}

const ProfileServices = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="px-4 overflow-hidden">
            <section className="border-t pt-7 flex flex-col gap-6">
                <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center'>
                    <h2 className="font-medium text-2xl">Services</h2>
                    <Link to="/services" className='text-purple-500 underline text-sm flex items-center gap-1'>
                        Browse Full List
                        <BiArrowBack className="text-xl rotate-[135deg]" />
                    </Link>
                </div>
                <div>
                    {props.services.length ?
                        <Slider startsWith={1} endsWith={3} isAutoGenerateSlides isPagination={false} isAutoPlay={false} >
                            {props.services.map(service => <SwiperSlide tag='li' key={service._id}>
                                <Service serviceInfo={service} profile={props.profile} />
                            </SwiperSlide>)}
                        </Slider>
                        :
                        <p className='text-slate-500 mb-12'>Empty..</p>
                    }
                </div>
            </section>
        </div >
    )
}

export default ProfileServices
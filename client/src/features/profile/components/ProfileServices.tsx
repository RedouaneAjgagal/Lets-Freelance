import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import Slider from '../../../components/Slider'
import { SwiperSlide } from 'swiper/react'
import TrendingService from '../../../components/home/TrendingService'

interface Props {
    services: {
        _id: string;
        img: string;
        category: string;
        title: string;
        rate: number;
        reviews: number;
        user: {
            img: string;
            name: string;
        };
        price: number;
    }[]
}

const ProfileServices = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="px-4 overflow-hidden">
            <section className="border-t pt-7 flex flex-col gap-1">
                <h2 className="font-medium text-2xl ">Services</h2>
                <Link to="/" className='text-purple-500 underline text-sm flex items-center gap-1 self-start mb-6'>
                    Browse Full List
                    <BiArrowBack className="text-xl rotate-[135deg]" />
                </Link>
                {props.services.length ?
                    <Slider navigationClassName="services" slidesPerView={1} isPagination={false} isAutoPlay={false} >
                        {props.services.map(service => <SwiperSlide tag='li' key={service._id}>
                            <TrendingService serviceInfo={service} />
                        </SwiperSlide>)}
                    </Slider>
                    :
                    <p className='text-slate-500 mb-12'>Empty..</p>
                }
            </section>
        </div >
    )
}

export default ProfileServices
import { BiArrowBack } from "react-icons/bi"
import { Swiper } from "../layouts/swiper";

interface SliderProps {
    navigationClassName?: string;
    isAutoPlay: boolean;
    isPagination: boolean;
};

type SliderAutoGenerateSlides = {
    isAutoGenerateSlides: true;
    startsWith: number;
} & SliderProps;

type SliderWithSlides = {
    isAutoGenerateSlides: false;
    slidesPerView: number;
} & SliderProps;

const Slider = (props: React.PropsWithChildren<SliderAutoGenerateSlides | SliderWithSlides>) => {
    const prevEl = `prev-${props.navigationClassName}`;
    const nextEl = `next-${props.navigationClassName}`;
    return (
        <div className='relative'>
            {props.navigationClassName ?
                <button className={`${prevEl} absolute -left-3 top-[47%] -translate-y-1/2 z-20 w-9 h-9 flex justify-center items-center bg-white/90 rounded-full text-slate-500 shadow-lg`}>
                    <BiArrowBack />
                </button>
                : null
            }
            {props.isAutoGenerateSlides
                ? <Swiper navigation={props.navigationClassName ? true : false} autoPlay={props.isAutoPlay} pagination={props.isPagination} isAutoGenerateSlides={true} startsWith={props.startsWith} spaceBetween={10} prevEl={prevEl} nextEl={nextEl} >
                    {props.children}
                </Swiper>
                : <Swiper navigation={props.navigationClassName ? true : false} autoPlay={props.isAutoPlay} pagination={props.isPagination} isAutoGenerateSlides={false} slidesPerView={props.slidesPerView} spaceBetween={10} prevEl={prevEl} nextEl={nextEl} >
                    {props.children}
                </Swiper>
            }
            {props.navigationClassName ?
                <button className={`${nextEl} absolute -right-3 top-[47%] -translate-y-1/2 z-20 w-9 h-9 flex justify-center items-center bg-white/90 rounded-full text-slate-500 shadow-lg`}>
                    <BiArrowBack className="rotate-180" />
                </button>
                :
                null
            }
        </div>
    )
}

export default Slider
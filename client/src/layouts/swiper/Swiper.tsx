import { Swiper as SwiperContainer } from "swiper/react";

type SwiperProps = {
    spaceBetween: number;
    navigation: boolean;
    nextEl?: string;
    prevEl?: string;
    pagination: boolean;
    autoPlay: boolean;
};

type SwiperAutoGenerateSlides = {
    isAutoGenerateSlides: true;
    startsWith: number;
} & SwiperProps;

type SwiperWithSlides = {
    isAutoGenerateSlides: false;
    slidesPerView: number;
} & SwiperProps;

const Swiper = (props: React.PropsWithChildren<SwiperAutoGenerateSlides | SwiperWithSlides>) => {

    return (
        <SwiperContainer
            spaceBetween={props.spaceBetween}
            slidesPerView={props.isAutoGenerateSlides ? undefined : props.slidesPerView}
            breakpoints={props.isAutoGenerateSlides
                ? {
                    0: {
                        slidesPerView: props.startsWith,
                    },
                    540: {
                        slidesPerView: 2,
                    },
                    880: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4
                    },
                }
                : undefined
            }
            navigation={props.navigation ? { nextEl: `.${props.nextEl}`, prevEl: `.${props.prevEl}` } : false}
            pagination={props.pagination ? { clickable: true } : false}
            wrapperTag="ul"
            autoplay={props.autoPlay ? { disableOnInteraction: false, pauseOnMouseEnter: true, delay: 7000 } : false}
        >
            {props.children}
        </SwiperContainer>
    )
}

export default Swiper;
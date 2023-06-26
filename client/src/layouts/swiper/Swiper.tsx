import { Swiper as SwiperContainer } from "swiper/react";

interface Props {
    spaceBetween: number;
    slidesPerView: number;
    navigation: boolean;
    nextEl?: string;
    prevEl?: string;
    pagination: boolean;
}

const Swiper = (props: React.PropsWithChildren<Props>) => {
    return (
        <SwiperContainer
            spaceBetween={props.spaceBetween}
            slidesPerView={props.slidesPerView}
            navigation={props.navigation ? { nextEl: `.${props.nextEl}`, prevEl: `.${props.prevEl}` } : false}
            pagination={props.pagination ? { clickable: true } : false}
            wrapperTag="ul"
        >
            {props.children}
        </SwiperContainer>
    )
}

export default Swiper;
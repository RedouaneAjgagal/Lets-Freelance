import TrendingService from "./TrendingService"
import { SwiperSlide } from "swiper/react";
import Slider from "../Slider";
import { useTrendingServicesQuery } from "../../features/service";
import Loading from "../Loading";

const TrendingServicesList = () => {
    const trendingServices = useTrendingServicesQuery();

    return (
        trendingServices.isLoading ?
            <Loading type="cards" display="grid" numOfCards={1} />
            :
            <Slider isAutoPlay navigationClassName="services" isPagination slidesPerView={1}>
                {trendingServices.data!.map(service =>
                    <SwiperSlide tag="li" key={service.service._id}>
                        <TrendingService serviceInfo={service} />
                    </SwiperSlide>
                )}
            </Slider>
    )
}

export default TrendingServicesList
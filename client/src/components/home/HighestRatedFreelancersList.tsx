import HighestRatedFreelancer from "./HighestRatedFreelancer"
import { SwiperSlide } from "swiper/react";
import Slider from "../Slider";
import useHighRatedFreelancersQuery from "../../features/profile/hooks/useHighRatedFreelancersQuery";
import Loading from "../Loading";

const HighestRatedFreelancersList = () => {

    const highRatedFreelancers = useHighRatedFreelancersQuery();

    return (
        <div className="mt-4">
            {
                highRatedFreelancers.isLoading ?
                    <Loading />
                    :
                    <Slider isPagination slidesPerView={1} isAutoPlay={false}>
                        {highRatedFreelancers.data!.map((freelancer) =>
                            <SwiperSlide key={freelancer._id}>
                                <HighestRatedFreelancer freelancerInfo={freelancer} />
                            </SwiperSlide>
                        )}
                    </Slider>
            }
        </div>
    )
}

export default HighestRatedFreelancersList
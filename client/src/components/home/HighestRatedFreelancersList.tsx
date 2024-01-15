import { SwiperSlide } from "swiper/react";
import Slider from "../Slider";
import useHighRatedFreelancersQuery from "../../features/profile/hooks/useHighRatedFreelancersQuery";
import Loading from "../Loading";
import FreelancerCard from "../FreelancerCard";

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
                            <SwiperSlide key={freelancer._id} className="pb-10">
                                <FreelancerCard freelancerInfo={freelancer} />
                            </SwiperSlide>
                        )}
                    </Slider>
            }
        </div>
    )
}

export default HighestRatedFreelancersList
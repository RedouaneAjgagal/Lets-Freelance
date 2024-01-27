import { SwiperSlide } from "swiper/react";
import Slider from "../../../components/Slider";
import { SingleServiceType } from "../services/getSingleService";

type SingleServiceGalleryProps = {
    featuredImage: SingleServiceType["featuredImage"];
    gallery: SingleServiceType["gallery"];
}

const SingleServiceGallery = (props: React.PropsWithoutRef<SingleServiceGalleryProps>) => {

    const images = [props.featuredImage, ...props.gallery];

    return (
        <section className="p-4 bg-slate-700 rounded">
            <Slider isAutoPlay={false} isPagination={false} slidesPerView={1} navigationClassName="singleService">
                {
                    images.map((image, index) => <SwiperSlide key={index}>
                        <img src={image} alt="service's images" className="w-full h-60 object-cover rounded" />
                    </SwiperSlide>)
                }
            </Slider>
        </section>
    )
}

export default SingleServiceGallery
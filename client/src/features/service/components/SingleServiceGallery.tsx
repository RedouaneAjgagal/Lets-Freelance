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
        <section className="flex bg-slate-700 p-3 flex-col gap-4 relative rounded sm:p-0 sm:bg-white">
            <Slider subImages={images} isAutoGenerateSlides={false} isAutoPlay={false} isPagination={false} slidesPerView={1} navigationClassName="singleService">
                {
                    images.map((image) => <SwiperSlide key={image}>
                        <img src={image} alt="service's images" className="w-full h-64 min-h-full  object-cover rounded sm:h-[30rem] md:h-[36rem] xl:h-[40rem]" />
                    </SwiperSlide>)
                }
            </Slider>
        </section>
    )
}

export default SingleServiceGallery
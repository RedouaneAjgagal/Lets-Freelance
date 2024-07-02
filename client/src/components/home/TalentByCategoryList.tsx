import TalentByCategory from "./TalentByCategory";
import { SwiperSlide } from "swiper/react";
import Slider from "../Slider";
import designCreativeImg from "/design-creative.png";
import digitalMarketingImg from "/digital-marketing.png";
import financeAccountingImg from "/finance-accounting.png";
import musicAudioImg from "/music-audio.png";
import programmingTechImg from "/programming-tech.png";
import videoAnimationImg from "/video-animation.png";
import writingTranslationImg from "/writing-translation.png";

const telentCategory = [
    {
        _id: "1",
        img: programmingTechImg,
        category: "programming & tech"
    },
    {
        _id: "2",
        img: designCreativeImg,
        category: "design & creative"
    },
    {
        _id: "3",
        img: digitalMarketingImg,
        category: "digital marketing"
    },
    {
        _id: "4",
        img: writingTranslationImg,
        category: "writing & translation"
    },
    {
        _id: "5",
        img: videoAnimationImg,
        category: "video & animation"
    },
    {
        _id: "6",
        img: financeAccountingImg,
        category: "finance & accounting"
    },
    {
        _id: "7",
        img: musicAudioImg,
        category: "music & audio"
    },
] as const;

const TalentByCategoryList = () => {
    return (
        <div className="mt-4">
            <Slider slidesPerView={2} isPagination isAutoPlay>
                {telentCategory.map((category) =>
                    <SwiperSlide key={category._id} tag="li">
                        <TalentByCategory categoryInfo={category} />
                    </SwiperSlide>
                )}
            </Slider>
        </div>
    )
}

export default TalentByCategoryList
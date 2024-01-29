import { useState } from "react"
import { SingleServiceType } from "../services/getSingleService";
import ReviewTabs from "../../../components/ReviewTabs";
import { TbStarFilled } from "react-icons/tb";
import ThisProjectReviews from "./ThisProjectReviews";
import AllProjectsReviews from "./AllProjectsReviews";

type ServiceReviewsProps = {
  rating: SingleServiceType["rating"];
  numOfAllReviews: number;
  profileId: string;
}

const ServiceReviews = (props: ServiceReviewsProps) => {

  const firstTab = `This project (${props.rating.numOfReviews})`;
  const secondTab = `All projects (${props.numOfAllReviews})`;

  const [serviceReviewTab, setServiceReviewTab] = useState<string>(firstTab);

  const numOfReviewsPluralize = props.rating.numOfReviews === 1 ? "" : "s";
  const numOfReviews = `${props.rating.numOfReviews} review${numOfReviewsPluralize}`;

  const tabs = [firstTab, secondTab];

  const clickTabHandler = (tab: string) => {
    setServiceReviewTab(tab);
  }

  const tabContents = {
    [firstTab]: <ThisProjectReviews />,
    [secondTab]: <AllProjectsReviews profileId={props.profileId} />
  };

  const content = tabContents[serviceReviewTab];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3 font-medium text-xl">
        <TbStarFilled size={20} className="text-purple-600" />
        <span>{props.rating.avgRate!.toFixed(1)}</span>
        <span>-</span>
        <span>{numOfReviews}</span>
      </div>
      <ReviewTabs tabs={tabs} currentTabOn={serviceReviewTab} onClick={clickTabHandler} />
      {content}
    </section>
  )
}

export default ServiceReviews
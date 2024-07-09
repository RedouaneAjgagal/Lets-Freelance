import { Link, useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import Badge from "../layouts/brand/Badge";
import { useFavoritesMutation } from "../features/favorites";
import FavoriteHeartButton from "./FavoriteHeartButton";
import formatProfileName from "../utils/formatProfileName";
import { BsFillLightningFill } from "react-icons/bs";
import { ServiceType } from "../features/service/services/searchServices";
import { useEffect, useRef, useState } from "react";
import { useTrackAdEngagementMutation } from "../features/advertisement";
import { useQueryClient } from "@tanstack/react-query";
import formatSearchQueries from "../utils/formatSearchQueries";

type Rating = {
  avgRate?: number;
  numOfReviews: number;
};

export type ServiceCardType = {
  service: ServiceType;
  serviceBy: {
    _id: string;
    name: string;
    avatar: string;
    userAs?: "freelancer",
    roles: {
      freelancer: {
        badge: "none" | "rising talent" | "top rated" | "top rated plus";
        englishLevel?: "basic" | "conversational" | "fluent" | "native" | "professional";
      };
    };
    rating?: Rating;
    country?: string;
  }
}

type ServiceCardWithoutFavorite = {
  serviceDetails: ServiceCardType;
  hideFavorite: true;
};

type ServiceCardWithFavorite = {
  serviceDetails: ServiceCardType;
  hideFavorite?: false;
  favorite: {
    isFavorite: boolean
  }
};

type ServiceCardProps = ServiceCardWithoutFavorite | ServiceCardWithFavorite;

const ServiceCard = (props: React.PropsWithoutRef<ServiceCardProps>) => {
  const mutationClient = useQueryClient();
  const [isInView, setIsInView] = useState(false);
  const trackAdEngagementMutation = useTrackAdEngagementMutation({
    adId: props.serviceDetails.service.sponsored ? props.serviceDetails.service.ad._id : undefined
  });

  const serviceRef = useRef<HTMLLIElement>(null);

  const favoritesMutation = useFavoritesMutation({
    event: "service",
    target: props.serviceDetails.service._id
  });

  const navigate = useNavigate();

  const serviceNavigator = () => {
    const adQueries: { ad_id?: string } = {};

    if (props.serviceDetails.service.sponsored) {
      adQueries.ad_id = props.serviceDetails.service.ad._id;
    }

    const searchQuery = formatSearchQueries(adQueries);
    navigate(`/services/${props.serviceDetails.service._id}${searchQuery}`);
  }

  const favoriteServiceToggle = () => {
    if (!props.hideFavorite) {
      favoritesMutation.mutate({
        event: "service",
        target: props.serviceDetails.service._id
      });
    }
  }

  const freelancerName = formatProfileName(props.serviceDetails.serviceBy.name);


  // Set sponsored service inView whenever its 30% inViewPort
  useEffect(() => {
    if (props.serviceDetails.service.sponsored) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      }, {
        root: null,
        rootMargin: "0px",
        threshold: 0.3
      });

      if (serviceRef.current) {
        observer.observe(serviceRef.current);
      }

      return () => {
        if (serviceRef.current) {
          observer.unobserve(serviceRef.current);
        }
      }
    }
  }, []);


  // Track AD engagement
  useEffect(() => {
    if (isInView && props.serviceDetails.service.sponsored) {
      const mutationCache = mutationClient.getMutationCache();
      const hasFetched = mutationCache.find({ mutationKey: ["trackAdEngagement", props.serviceDetails.service.ad._id], exact: true }) ?
        true
        : false;

      // track ad engagement only if it hasen't been tracked onmount (to prevent tracking each time scrolling on the same AD)
      if (!hasFetched) {
        trackAdEngagementMutation.mutate({
          adId: props.serviceDetails.service.ad._id
        });
      }
    }
  }, [isInView]);

  return (
    <li ref={serviceRef} role="link" onClick={serviceNavigator} className="text-left border rounded hover:cursor-pointer flex flex-col">
      <div className="relative">
        {props.serviceDetails.service.sponsored ?
          <span className="absolute -top-3 left-2 bg-amber-200 font-semibold tracking-wide rounded-full p-[0.2rem] px-3 border text-sm flex items-center gap-1">
            <BsFillLightningFill />
            Sponsored
          </span>
          : null
        }
        <img src={props.serviceDetails.service.featuredImage} className="rounded-t w-full max-w-full min-h-full h-64 object-cover group-hover:scale-125 duration-500" />
        {!props.hideFavorite && props.favorite ?
          <FavoriteHeartButton onClick={() => favoriteServiceToggle()} fillHeart={props.favorite.isFavorite} />
          :
          null
        }
      </div>
      <div className="px-3 py-4 flex flex-col gap-2">
        <div>
          <span className="text-slate-500 hover:text-slate-900 duration-200 text-sm">{props.serviceDetails.service.category}</span>
        </div>
        <h3 className="text-black font-semibold text-lg">{props.serviceDetails.service.title}</h3>
        <div className="flex items-center justify-between gap-2 text-sm mt-2">
          <div className="text-sm text-slate-600">
            <p>From: <span className="text-lg text-black font-medium">${props.serviceDetails.service.tier.starter.price}</span></p>
          </div>
          {
            props.serviceDetails.service.rating.avgRate ?
              <div className="flex items-center gap-1 flex-wrap">
                <AiFillStar className="text-yellow-500 text-lg" />
                <span className="font-semibold text-black text-[1.05rem]">{props.serviceDetails.service.rating.avgRate || 0}</span>
                <span className="text-slate-500">{`(${props.serviceDetails.service.rating.numOfReviews} Reviews)`}</span>
              </div>
              :
              null
          }
        </div>
      </div>
      <div className="px-3 h-full flex items-end">
        <div className={`border-t py-4 w-full ${props.serviceDetails.serviceBy.rating && props.serviceDetails.serviceBy.rating.avgRate ? "" : "flex"}`}>
          <Link to={`/profiles/${props.serviceDetails.serviceBy._id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            <img src={props.serviceDetails.serviceBy.avatar} alt="user image" className="w-9 h-9 object-cover rounded-full" />
            <div className="w-full flex flex-col">
              <div className="flex gap-2 items-center justify-between flex-wrap gap-y-0">
                <span className="hover:underline">
                  {freelancerName}
                </span>
                {
                  props.serviceDetails.serviceBy.rating && props.serviceDetails.serviceBy.rating.avgRate ?
                    <div className="flex items-center gap-1 flex-wrap">
                      <AiFillStar className="text-yellow-500 text-lg" />
                      <span className="font-semibold text-black text-[1.05rem]">{props.serviceDetails.serviceBy.rating.avgRate || 0}</span>
                      <span className="text-slate-500">{`(${props.serviceDetails.serviceBy.rating.numOfReviews})`}</span>
                    </div>
                    :
                    null
                }
              </div>
              {props.serviceDetails.serviceBy.roles.freelancer.badge === "none" ?
                null
                :
                <div>
                  <Badge badge={props.serviceDetails.serviceBy.roles.freelancer.badge} size="sm" />
                </div>
              }
            </div>
          </Link>
        </div>
      </div>
    </li>
  )
}

export default ServiceCard;
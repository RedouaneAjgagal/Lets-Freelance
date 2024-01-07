import { Link } from "react-router-dom";
import { FavoriteService } from "../services/getFavorites"
import { AiFillStar, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Badges from "../../../layouts/brand/Badges";

type FavoriteServiceType = {
  serviceDetails: FavoriteService;
  favorite: {
    isFavorite: boolean
  }
};

const FavouriteService = (props: React.PropsWithoutRef<FavoriteServiceType>) => {

  const serviceNavigator = () => {
    console.log({ to: props.serviceDetails.service._id });
  }

  const favoriteServiceToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log({ favorite: props.serviceDetails.service._id });
  }

  const [firstName, secondName] = props.serviceDetails.serviceBy.name.split(" ");
  const freelancerName = `${firstName.slice(0, 1).toUpperCase()}${firstName.slice(1)} ${secondName !== undefined ? `${secondName.slice(0, 1).toUpperCase()}.` : ""}`;

  const favorites = {
    "true": <AiFillHeart className="text-red-500 text-xl z-10" />,
    "false": <AiOutlineHeart className="text-red-500 text-xl z-10" />
  } as const;

  return (
    <li role="link" onClick={serviceNavigator} className="text-left border rounded hover:cursor-pointer">

      <div className="relative">
        <img src={props.serviceDetails.service.featuredImage} className="rounded-t w-full max-w-full min-h-full h-64 object-cover group-hover:scale-125 duration-500" />
        {props.favorite ?
          <button onClick={favoriteServiceToggle} className="absolute top-3 right-3 p-2 bg-white rounded-full border-2 border-slate-100 shadow-lg z-30">{favorites[props.favorite.isFavorite ? "true" : "false"]}</button>
          :
          null
        }
      </div>
      <div className="px-3 py-4 flex flex-col gap-2">
        <div>
          <Link to={"/category"} className="text-slate-500 hover:text-slate-900 duration-200 text-sm">{props.serviceDetails.service.category}</Link>
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
      <div className="px-3">
        <div className="border-t py-4">
          <div className="flex items-center gap-2">
            <img src={props.serviceDetails.serviceBy.avatar} alt="user image" className="w-9 h-9 object-cover rounded-full" />
            <div className="w-full flex flex-col">
              <div className="flex gap-2 items-center justify-between flex-wrap gap-y-0">
                <Link to={`/profiles/${props.serviceDetails.serviceBy._id}`} className="hover:underline">
                  {freelancerName}
                </Link>
                {
                  props.serviceDetails.serviceBy.rating.avgRate ?
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
                  <Badges badge={props.serviceDetails.serviceBy.roles.freelancer.badge} />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default FavouriteService
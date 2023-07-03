import { BiMenuAltRight, BiX, BiSearch } from "react-icons/bi";
import { Logo } from "../brand";
import { useState, useEffect } from "react";
import MenuModel from "./MenuModel";
import SearchModel from "./SearchModel";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import useLogoutMutation from "../../features/auth/hooks/useLogoutMutation";

const Navbar = () => {
  const { userInfo } = useAppSelector(state => state.authReducer);

  const [menu, setMenu] = useState({
    isOpen: false,
    overflowStyle: "auto"
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const menuHandler = () => {
    setMenu((isOpen) => {
      if (isOpen.isOpen) {
        return { isOpen: false, overflowStyle: "auto" };
      } else {
        return { isOpen: true, overflowStyle: "hidden" };
      }
    });
  }

  useEffect(() => {
    document.body.style.overflow = menu.overflowStyle;
  }, [menu]);

  const searchHandler = () => {
    setIsSearchOpen((isOpen) => !isOpen);
  }

  const logoutMutation = useLogoutMutation("Logged out");
  const logoutHandler = () => {
    logoutMutation.mutate();
  }

  return (
    <div className="bg-white">
      <nav className="flex items-center justify-between py-3 px-2 border-b">
        <div className="flex items-center gap-2">
          <button onClick={menuHandler} className="text-[2.2rem] text-slate-700">
            {menu.isOpen ?
              <BiX />
              :
              <BiMenuAltRight />
            }
          </button>
          <Logo />
        </div>
        <div>
          {userInfo ?
            <button onClick={logoutHandler}>Logout</button>
            :
            menu.isOpen ?
              <button onClick={searchHandler} className="flex p-1 text-2xl text-slate-700">
                <BiSearch />
              </button>
              :
              <Link to="/auth/register" className="p-2 font-medium text-slate-700">Sign Up</Link>
          }
        </div>
      </nav>
      <MenuModel isShown={menu.isOpen} onClick={menuHandler} />
      <SearchModel isShown={isSearchOpen} closeModel={searchHandler} />
      <div className={`fixed bottom-0 z-50 w-full bg-white duration-150 ${menu.isOpen ? "left-0" : "-left-full"}`}>
        <Link onClick={menuHandler} to={"/auth/register"} className="p-3 flex justify-center bg-purple-800 text-white text-lg tracking-wide font-medium rounded-t-lg">Register</Link>
      </div>
    </div>
  )
}

export default Navbar
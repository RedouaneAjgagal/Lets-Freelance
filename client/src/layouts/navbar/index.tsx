import { BiMenuAltRight, BiX, BiSearch } from "react-icons/bi";
import { Logo, PrimaryLink } from "../brand";
import { useEffect, useState } from "react";
import MenuModel from "./MenuModel";
import SearchModel from "./SearchModel";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import UserNav from "./UserNav";
import useOverflow from "../../hooks/useOverflow";

const Navbar = () => {
  const { userInfo } = useAppSelector(state => state.authReducer);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const menuHandler = () => {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  const searchHandler = () => {
    setIsSearchOpen((isOpen) => !isOpen);
  }

  useEffect(() => {
    if (!isMenuOpen) return;

    const checkBreakpoint = () => {
      const isDesktopSize = window.matchMedia('(min-width: 880px)').matches;
      if (isDesktopSize) {
        closeNavbarHandler();
      }
    };

    const resizeListener = () => {
      checkBreakpoint();
    };

    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [isMenuOpen]);

  useOverflow(isMenuOpen);

  const closeNavbarHandler = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }

  return (
    <div>
      <nav className="flex items-center py-3 px-2 justify-between md:px-4 md:gap-0 md:w-full md:items-center">
        <div className="flex items-center gap-2">
          <button onClick={menuHandler} className="text-[2.2rem] text-slate-700 md:hidden">
            <BiMenuAltRight />
          </button>
          <Logo />
        </div>
        <div className="md:ml-3 xl:ml-6 w-full">
          <MenuModel onSearch={searchHandler} isShown={isMenuOpen} onClick={menuHandler} />
        </div>
        <div className="lg:relative">
          <SearchModel isShown={isSearchOpen} closeSearchModal={searchHandler} closeNavbar={closeNavbarHandler} />
        </div>
        {userInfo
          ? <div className="ml-3">
            <UserNav />
          </div>
          : <div className="flex  items-centerfont-medium text-slate-600">
            <Link to="/auth/login" className="hidden md:flex md:py-1 md:px-4 md:md:px-4 md:hover:text-slate-900 md:transition-all md:font-medium md:text-slate-600">Login</Link>
            <PrimaryLink to="/auth/register" fullWith={false} justifyConent="center" x="lg" y="sm">Register</PrimaryLink>
          </div>
        }
      </nav>
    </div>
  )
}

export default Navbar
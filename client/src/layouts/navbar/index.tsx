import { BiMenuAltRight, BiX, BiSearch } from "react-icons/bi";
import Logo from "../brand/Logo";
import { useState } from "react";
import MenuModel from "./MenuModel";
import SearchModel from "./SearchModel";
import { Link } from "react-router-dom";

const index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const menuHandler = () => {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  const searchHandler = () => {
    setIsSearchOpen((isOpen) => !isOpen);
  }

  return (
    <div className="bg-white">
      <nav className="flex items-center justify-between py-3 px-2 border-b">
        <div className="flex items-center gap-2">
          <button onClick={menuHandler} className="text-[2.2rem] text-slate-700">
            {isMenuOpen ?
              <BiX />
              :
              <BiMenuAltRight />
            }
          </button>
          <Logo />
        </div>
        <div>
          {isMenuOpen ?
            <button onClick={searchHandler} className="flex p-1 text-2xl text-slate-700">
              <BiSearch />
            </button>
            :
            <Link to="/auth/register" className="p-2 font-medium text-slate-700">Sign Up</Link>
          }
        </div>
      </nav>
      <MenuModel isShown={isMenuOpen} />
      <SearchModel isShown={isSearchOpen} closeModel={searchHandler} />
      <div className={`fixed bottom-0 w-full bg-white duration-150 ${isMenuOpen ? "left-0" : "-left-full"}`}>
        <Link to={"/auth/register"} className="p-3 flex justify-center bg-indigo-500 text-white text-lg tracking-wide font-medium rounded-t-lg">Register</Link>
      </div>
    </div>
  )
}

export default index
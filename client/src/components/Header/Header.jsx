import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { TbSearch } from "react-icons/tb";
import { CgShoppingCart } from "react-icons/cg";
import { AiOutlineHeart } from "react-icons/ai";

import Search from "./Search/Search";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist"; // Import premium sliding Wishlist drawer
import { Context } from "../../utils/context";

import "./Header.scss";
const Header = () => {
  //creating a navigate instances for navgihation
  const navigate = useNavigate();
  const { cartCount, wishlistItems } = useContext(Context); // Extract wishlistItems from context

  const [schorlled, setschorlled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false); // Wishlist visibility trigger

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200) {
      setschorlled(true);
    } else {
      setschorlled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <header className={`main-header ${schorlled ? "sticky-header" : ""}`}>
        <div className="header-content">
          <ul className="left">
            <li onClick={() => navigate("/")}>Home</li>
            <li>About</li>
            <li>Categories</li>
          </ul>
          <div className="center" onClick={() => navigate("/")}>
            SearchStore
          </div>
          <div className="right">
            <TbSearch onClick={() => setShowSearch(true)} />
            
            {/* Interactive Wishlist Heart Trigger */}
            <span className="wishlist-icon" onClick={() => setShowWishlist(true)}>
              <AiOutlineHeart />
              {!!wishlistItems?.length && <span>{wishlistItems.length}</span>}
            </span>

            <span className="cart-icon" onClick={() => setShowCart(true)}>
              <CgShoppingCart />
              {!!cartCount && <span>{cartCount}</span>}
            </span>
          </div>
        </div>
      </header>
      {showCart && <Cart setShowCart={setShowCart} />}
      {showSearch && <Search setShowSearch={setShowSearch} />}
      {showWishlist && <Wishlist setShowWishlist={setShowWishlist} />}
    </>
  );
};

export default Header;


// to navigate to each product page
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegHeart, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Context } from "../../../utils/context";
import "./Product.scss";

const Product = ({ id, data }) => {
  const navigate = useNavigate();
  const { handleAddToCart, handleAddToWishlist, wishlistItems } =
    useContext(Context);

  // Check if this product is currently in the wishlist
  const isWishlisted = wishlistItems.some((item) => item.id === id);

  // Create a realistic crossed-out original price (40% markup)
  const originalPrice = Math.round(data.price * 1.4);
  const discountPercent = 28; // Standard commercial discount rate

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevents navigating to product details page
    handleAddToWishlist({ id, attributes: data });
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Prevents navigating to product details page
    handleAddToCart({ id, attributes: data }, 1);
  };

  return (
    <div className="product-card" onClick={() => navigate("/product/" + id)}>
      <div className="thumbnail-container">
        {/* Floating Sale Badge */}
        <span className="sale-badge">-{discountPercent}% OFF</span>

        {/* Floating Heart Button */}
        <button className="wishlist-btn" onClick={handleWishlistClick}>
          {isWishlisted ? (
            <FaHeart className="heart-icon active" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
        </button>

        {/* Product Image Thumbnail */}
        <div className="thumbnail">
          <img
            src={(process.env.REACT_APP_DEV_URL || "").replace(/\/$/, "") + data.img.data[0].attributes.url}
            alt={data.title}
          />
        </div>

        {/* Quick Add To Cart Slide-up */}
        <div className="quick-add" onClick={handleAddToCartClick}>
          <FaShoppingCart className="cart-icon-btn" />
          <span>Quick Add</span>
        </div>
      </div>

      <div className="prod-details">
        {/* Brand Identifier */}
        <span className="brand-tag">SearchStore Premium</span>

        {/* Product Title */}
        <span className="name" title={data.title}>
          {data.title}
        </span>

        {/* Ratings Star Row */}
        <div className="rating-row">
          <div className="stars">
            <FaStar className="star-icon fill" />
            <FaStar className="star-icon fill" />
            <FaStar className="star-icon fill" />
            <FaStar className="star-icon fill" />
            <FaStar className="star-icon fill" />
          </div>
          <span className="reviews-count">(4.8 • 108 reviews)</span>
        </div>

        {/* Price Breakdown */}
        <div className="price-box">
          <span className="price discounted">&#8377;{data.price}</span>
          <span className="original-price">&#8377;{originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;

import { useContext } from "react";
import { MdClose } from "react-icons/md";
import { FaTrashAlt, FaShoppingCart, FaHeart } from "react-icons/fa";
import { Context } from "../../utils/context";
import "./Wishlist.scss";

const Wishlist = ({ setShowWishlist }) => {
  const { wishlistItems, handleAddToWishlist, handleAddToCart } =
    useContext(Context);

  const handleMoveToCart = (item) => {
    // 1. Add to shopping cart context
    handleAddToCart(item, 1);
    // 2. Remove from wishlist context
    handleAddToWishlist(item);
  };

  return (
    <div className="wishlist-panel">
      {/* Semi-transparent Backdrop layer */}
      <div className="opac-layer" onClick={() => setShowWishlist(false)}></div>
      
      {/* Dynamic Slide-in Panel */}
      <div className="wishlist-content">
        <div className="wishlist-header">
          <span className="heading">My Wishlist</span>
          <span className="close-btn" onClick={() => setShowWishlist(false)}>
            <MdClose />
            <span className="text">close</span>
          </span>
        </div>

        {/* Empty Wishlist State */}
        {!wishlistItems?.length && (
          <div className="empty-wishlist">
            <FaHeart className="heart-broken" />
            <span>Your wishlist is empty.</span>
            <button className="return-cta" onClick={() => setShowWishlist(false)}>
              CONTINUE SHOPPING
            </button>
          </div>
        )}

        {/* Wishlist Items List */}
        {!!wishlistItems?.length && (
          <div className="wishlist-products">
            {wishlistItems.map((item) => (
              <div className="wishlist-product" key={item.id}>
                {/* Product Thumbnail */}
                <div className="img-container">
                  <img
                    src={
                      (process.env.REACT_APP_DEV_URL || "").replace(/\/$/, "") +
                      item.attributes.img.data[0].attributes.url
                    }
                    alt={item.attributes.title}
                  />
                </div>

                {/* Product Metadata & Actions */}
                <div className="prod-details">
                  <span className="name">{item.attributes.title}</span>
                  <span className="price">&#8377;{item.attributes.price}</span>
                  
                  <div className="action-buttons">
                    {/* Move/Add to Cart Action */}
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleMoveToCart(item)}
                    >
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </button>

                    {/* Delete/Remove Action */}
                    <button
                      className="remove-btn"
                      onClick={() => handleAddToWishlist(item)}
                      title="Remove from wishlist"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

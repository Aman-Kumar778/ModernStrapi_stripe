import { useNavigate } from "react-router-dom";
//for navigating to each category page onclick and with id we wil ues useNavigate laiv
import "./Category.scss";

const Category = ({ categories }) => {
  //now we need to create instace of the class
  const navigate = useNavigate();
  return (
    <div className="shop-by-category">
      <div className="categories">
        {categories?.data?.map((item) => (
          <div
            key={item.id}
            className="category"
            onClick={() => navigate(`/category/${item.id}`)}
          >
            <img
              src={
                (process.env.REACT_APP_DEV_URL || "").replace(/\/$/, "") +
                item.attributes.img.data.attributes.url
              }
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;

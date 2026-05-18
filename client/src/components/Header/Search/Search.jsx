import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { fetchDataFromApi } from "../../../utils/api";
import "./Search.scss";

const Search = ({ setShowSearch }) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (!query.trim().length) {
      setData(null);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetchDataFromApi(
        `/api/products?populate=*&filters[title][$containsi]=${query}`
      );
      setData(res);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-modal">
      <div className="form-field">
        <input
          type="text"
          autoFocus
          placeholder="Search for Products"
          value={query}
          onChange={onChange}
        />
        <MdClose onClick={() => setShowSearch(false)} />
      </div>

      <div className="search-result-content">
        <div className="search-results">
          {data?.data?.map((item) => (
            <div
              key={item.id}
              className="search-result-item"
              onClick={() => {
                navigate("/product/" + item.id);
                setShowSearch(false);
              }}
            >
              <div className="img-container">
                <img
                  src={
                    process.env.REACT_APP_DEV_URL +
                    item.attributes.img.data[0].attributes.url
                  }
                  alt={item.attributes.title}
                />
              </div>
              <div className="prod-details">
                <span className="name">{item.attributes.title}</span>
                <span className="desc">{item.attributes.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;


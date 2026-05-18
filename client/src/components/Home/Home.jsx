import { useEffect, useContext } from "react";

import "./Home.scss";

import Banner from "./Banner/Banner";
import Category from "./Category/Category";
import Products from "../Products/Products";

import { fetchDataFromApi } from "../../utils/api";
import { Context } from "../../utils/context";

const Home = () => {
  // using context object to access the value of the context api
  const { categories, setCategories, products, setProducts } =
    useContext(Context);

  //for the useeffect of the apis

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);
  // for the product apis context

  const getProducts = () => {
    fetchDataFromApi("/api/products?populate=*").then((res) => {
      console.log(res);
      setProducts(res);
    });
  };
  // const getCategories = () => {
  //   fetchDataFromApi("/api/categories?populate=*").then((res) =>
  //     console.log(res)
  //   );
  // }; same avove fucntion using mutiple arow fucn line
  const getCategories = () => {
    fetchDataFromApi("/api/categories?populate=*").then((res) => {
      console.log(res);
      setCategories(res);
    });
  };

  return (
    <div className="home">
      <Banner />
      <div className="main-content">
        <div className="layout">
          <Category categories={categories} />

          <Products products={products} headingText="Popular Products" />
        </div>
      </div>
    </div>
  );
};

export default Home;

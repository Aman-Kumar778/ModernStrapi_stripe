import axios from "axios";

const params = {
  headers: {
    Authorization: "bearer " + process.env.REACT_APP_STRIPE_APP_KEY,
  },
};

export const fetchDataFromApi = async (url) => {
  try {
    const baseUrl = (process.env.REACT_APP_DEV_URL || "").replace(/\/$/, "");
    const { data } = await axios.get(
      baseUrl + url,
      params
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

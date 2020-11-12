import axios from "axios";
import { normalizeData } from "../utils";

const FETCH_PRODUCTS = "products/FETCH_PRODUCTS";
const FETCH_PRODUCTS_SUCCESS = "products/FETCH_PRODUCTS_SUCCESS";
const FETCH_PRODUCTS_ERROR = "products/FETCH_PRODUCTS_ERROR";

const initialState = {
  status: "",
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return { ...state, status: "fetching" };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        status: "finished",
        data: normalizeData(action.payload),
      };
    case FETCH_PRODUCTS_ERROR:
      return {
        ...state,
        status: "error",
        error: "Algo salió mal",
      };
    default:
      return state;
  }
}

//actions

export const fetchProducts = () => ({
  type: FETCH_PRODUCTS,
});
export const fetchProductsSuccess = (payload) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload,
});

export const fetchProductsError = () => ({
  type: FETCH_PRODUCTS_ERROR,
});

// thunks
export const getProducts = () => (dispatch) => {
  dispatch(fetchProducts());
  return axios
    .get("http://localhost:4000/products")
    .then((res) => {
      dispatch(fetchProductsSuccess(res.data));
    })
    .catch(() => dispatch(fetchProductsError()));
};

import axios from "axios";
import { normalizeData } from "../utils";

const FETCH_CART = "cart/FETCH_CART";
const FETCH_CART_SUCCESS = "cart/FETCH_CART_SUCCESS";
const FETCH_CART_ERROR = "cart/FETCH_CART_ERROR";

const EDIT_CART = "cart/EDIT_CART";
const EDIT_CART_ERROR = "cart/EDIT_CART_ERROR";

const initialState = {
  status: "",
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CART:
      return { ...state, status: "fetching" };
    case FETCH_CART_SUCCESS:
      return {
        ...state,
        data: normalizeData(action.payload),
      };
    case FETCH_CART_ERROR:
      return {
        ...state,
        status: "error",
        error: "Algo salió mal",
      };
    case EDIT_CART:
      return {
        ...state,
        status: "finished",
        data: normalizeData(action.payload),
      };
    default:
      return state;
  }
}

//actions

export const fetchCart = () => ({
  type: FETCH_CART,
});
export const fetchCartSuccess = (payload) => ({
  type: FETCH_CART_SUCCESS,
  payload,
});

export const fetchCartError = () => ({
  type: FETCH_CART_ERROR,
});

export const cartItemsEdited = (payload) => ({
  type: EDIT_CART,
  payload,
});

export const cartItemsEditedError = (payload) => ({
  type: EDIT_CART_ERROR,
  payload,
});

// thunks
export const getCart = () => (dispatch) => {
  dispatch(fetchCart());
  return axios
    .get("http://localhost:4000/cart")
    .then((res) => dispatch(fetchCartSuccess(res.data.products)))
    .catch(() => dispatch(fetchCartError()));
};

export const editCart = (order) => (dispatch) => {
  console.log(order);
  return axios
    .patch("http://localhost:4000/cart", order)
    .then((res) => dispatch(cartItemsEdited(res.data.products)))
    .catch((error) => dispatch(cartItemsEditedError()));
};

import axios from "axios";
import { normalizeData } from "../utils";

const FETCH_CART = "cart/FETCH_CART";
const FETCH_CART_SUCCESS = "cart/FETCH_CART_SUCCESS";
const FETCH_CART_ERROR = "cart/FETCH_CART_ERROR";

const ADD_ITEM = "cart/ADD_ITEM";
const REMOVE_ITEM = "cart/REMOVE_ITEM";
const DELETE_PRODUCT = "cart/DELETE_PRODUCT";

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
        status: "finished",
        data: normalizeData(action.payload),
      };
    case FETCH_CART_ERROR:
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

export const ItemAdded = (payload) => ({
  type: ADD_ITEM,
  payload,
});

export const ItemRemoved = (payload) => ({
  type: REMOVE_ITEM,
  payload,
});

export const ItemDeleted = (payload) => ({
  type: DELETE_PRODUCT,
  payload,
});

// thunks
export const getCart = () => (dispatch) => {
  dispatch(fetchCart());
  return axios
    .get("http://localhost:4000/cart")
    .then((res) => {
      dispatch(fetchCartSuccess(res.data.products));
    })
    .catch(() => dispatch(fetchCartError()));
};

import axios from "axios";
import {
  CREATE_ITEM_REQUEST,
  CREATE_ITEM_SUCCESS,
  CREATE_ITEM_FAIL,
  ITEM_DETAILS_REQUEST,
  ITEM_DETAILS_SUCCESS,
  ITEM_DETAILS_FAIL,
  ITEM_LIST_REQUEST,
  ITEM_LIST_SUCCESS,
  ITEM_LIST_FAIL,
  ITEM_UPDATE_REQUEST,
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_FAIL,
  ITEM_DELETE_FAIL,
  ITEM_DELETE_REQUEST,
  ITEM_DELETE_SUCCESS,
  ITEM_ADD_REQUEST,
  ITEM_ADD_SUCCESS,
  ITEM_ADD_FAIL,
  ITEM_REMOVE_REQUEST,
  ITEM_REMOVE_SUCCESS,
  ITEM_REMOVE_FAIL,
  ITEM_OF_THE_DAY_REQUEST,
  ITEM_OF_THE_DAY_SUCCESS,
  ITEM_OF_THE_DAY_FAIL,
  ITEM_FAVORITE_REQUEST,
  ITEM_FAVORITE_SUCCESS,
  ITEM_FAVORITE_FAIL,
  ITEM_UNFAVORITE_REQUEST,
  ITEM_UNFAVORITE_SUCCESS,
  ITEM_UNFAVORITE_FAIL,
} from "../constants/item.constants";
import { USER_LOGIN_SUCCESS } from "../constants/user.constants";
import { getStoreDetails } from "./store.actions";
import { getUserDetails } from "./user.actions";

export const createItem = (item) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_ITEM_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/items`, item, config);

    dispatch({
      type: CREATE_ITEM_SUCCESS,
      payload: data,
    });

    localStorage.setItem("item", JSON.stringify(data));

    dispatch(getStoreDetails(data.store._id));
  } catch (error) {
    dispatch({
      type: CREATE_ITEM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getItemDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ITEM_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/items/${id}`);

    dispatch({ type: ITEM_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ITEM_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getItems = () => async (dispatch) => {
  try {
    dispatch({ type: ITEM_LIST_REQUEST });

    const { data } = await axios.get("/api/items");

    dispatch({ type: ITEM_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ITEM_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateItem = (item) => async (dispatch, getState) => {
  try {
    dispatch({ type: ITEM_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(`/api/items/${item._id}`, item, config);

    dispatch({
      type: ITEM_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ITEM_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteItem = (id, storeId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ITEM_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/items/${id}`, config);

    dispatch({
      type: ITEM_DELETE_SUCCESS,
      payload: data,
    });

    dispatch(getStoreDetails(storeId));
  } catch (error) {
    dispatch({
      type: ITEM_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addToItem = (item) => async (dispatch, getState) => {
  try {
    dispatch({ type: ITEM_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(
      `/api/items/${item._id}/add`,
      item,
      config
    );

    dispatch({
      type: ITEM_ADD_SUCCESS,
      payload: data,
    });

    dispatch(getItemDetails(data._id));
  } catch (error) {
    dispatch({
      type: ITEM_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const removeFromItem = (item) => async (dispatch, getState) => {
  try {
    dispatch({ type: ITEM_REMOVE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(
      `/api/items/${item._id}/remove`,
      item,
      config
    );

    dispatch({
      type: ITEM_REMOVE_SUCCESS,
      payload: data,
    });

    dispatch(getItemDetails(data._id));
  } catch (error) {
    dispatch({
      type: ITEM_REMOVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getItemOfTheDay = () => async (dispatch) => {
  try {
    dispatch({ type: ITEM_OF_THE_DAY_REQUEST });

    const { data } = await axios.get("/api/items/item");

    dispatch({ type: ITEM_OF_THE_DAY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ITEM_OF_THE_DAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const favoriteItem = (id, userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ITEM_FAVORITE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/items/${id}/favorite`,
      { userId },
      config
    );

    dispatch({
      type: ITEM_FAVORITE_SUCCESS,
      payload: data,
    });

    dispatch(getUserDetails(data._id));

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: ITEM_FAVORITE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const unFavoriteItem = (id, userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ITEM_UNFAVORITE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/items/${id}/unfavorite`,
      { userId },
      config
    );

    dispatch({
      type: ITEM_UNFAVORITE_SUCCESS,
      payload: data,
    });

    dispatch(getUserDetails(data._id));

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: ITEM_UNFAVORITE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

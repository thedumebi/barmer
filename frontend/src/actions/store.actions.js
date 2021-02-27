import axios from "axios";
import {
  CREATE_STORE_REQUEST,
  CREATE_STORE_SUCCESS,
  CREATE_STORE_FAIL,
  STORE_DETAILS_REQUEST,
  STORE_DETAILS_SUCCESS,
  STORE_DETAILS_FAIL,
  STORE_LIST_REQUEST,
  STORE_LIST_SUCCESS,
  STORE_LIST_FAIL,
  STORE_UPDATE_REQUEST,
  STORE_UPDATE_SUCCESS,
  STORE_UPDATE_FAIL,
  STORE_DELETE_FAIL,
  STORE_DELETE_REQUEST,
  STORE_DELETE_SUCCESS,
} from "../constants/store.constants";
import { getUserDetails } from "./user.actions";

export const createStore = (store) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_STORE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/stores`, store, config);

    dispatch({
      type: CREATE_STORE_SUCCESS,
      payload: data,
    });

    localStorage.setItem("store", JSON.stringify(data));

    dispatch(getUserDetails(data.owner._id));
  } catch (error) {
    dispatch({
      type: CREATE_STORE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getStoreDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: STORE_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/stores/${id}`);

    dispatch({ type: STORE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: STORE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getStores = () => async (dispatch) => {
  try {
    dispatch({ type: STORE_LIST_REQUEST });

    const { data } = await axios.get("/api/stores");

    dispatch({ type: STORE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: STORE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateStore = (store) => async (dispatch, getState) => {
  try {
    dispatch({ type: STORE_UPDATE_REQUEST });

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
      `/api/stores/${store._id}`,
      store,
      config
    );

    dispatch({
      type: STORE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STORE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteStore = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: STORE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/stores/${id}`, config);

    dispatch({
      type: STORE_DELETE_SUCCESS,
      payload: data,
    });

    dispatch(getUserDetails(userInfo._id));
  } catch (error) {
    dispatch({
      type: STORE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

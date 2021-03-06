import axios from "axios";
import {
  ADMIN_CREATE_CAROUSEL_FAIL,
  ADMIN_CREATE_CAROUSEL_REQUEST,
  ADMIN_CREATE_CAROUSEL_SUCCESS,
  ADMIN_CAROUSEL_DETAILS_FAIL,
  ADMIN_CAROUSEL_DETAILS_REQUEST,
  ADMIN_CAROUSEL_DETAILS_SUCCESS,
  ADMIN_DELETE_CAROUSEL_FAIL,
  ADMIN_DELETE_CAROUSEL_REQUEST,
  ADMIN_DELETE_CAROUSEL_SUCCESS,
  ADMIN_UPDATE_CAROUSEL_FAIL,
  ADMIN_UPDATE_CAROUSEL_REQUEST,
  ADMIN_UPDATE_CAROUSEL_SUCCESS,
  CAROUSEL_LIST_FAIL,
  CAROUSEL_LIST_REQUEST,
  CAROUSEL_LIST_SUCCESS,
} from "../constants/carousel.constants";

export const createCarousel = (carousel) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_CREATE_CAROUSEL_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/carousel", carousel, config);

    dispatch({
      type: ADMIN_CREATE_CAROUSEL_SUCCESS,
      payload: data,
    });

    dispatch(listCarousels());
  } catch (error) {
    dispatch({
      type: ADMIN_CREATE_CAROUSEL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listCarousels = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CAROUSEL_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/carousel", config);

    dispatch({
      type: CAROUSEL_LIST_SUCCESS,
      payload: data,
    });

    localStorage.setItem("carousels", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: CAROUSEL_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteCarousel = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_DELETE_CAROUSEL_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios
      .delete(`/api/carousel/${id}`, config)
      .then(() => dispatch(listCarousels()));

    dispatch({ type: ADMIN_DELETE_CAROUSEL_SUCCESS });
  } catch (error) {
    dispatch({
      type: ADMIN_DELETE_CAROUSEL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getCarouselDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_CAROUSEL_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/carousel/${id}`, config);

    dispatch({
      type: ADMIN_CAROUSEL_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_CAROUSEL_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateCarousel = (carousel) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADMIN_UPDATE_CAROUSEL_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    await axios.patch(`/api/carousel/${carousel._id}`, carousel, config);

    dispatch({ type: ADMIN_UPDATE_CAROUSEL_SUCCESS });
  } catch (error) {
    dispatch({
      type: ADMIN_UPDATE_CAROUSEL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

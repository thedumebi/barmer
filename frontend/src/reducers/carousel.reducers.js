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

export const createCarouselReducer = (state = { carousel: {} }, action) => {
  switch (action.type) {
    case ADMIN_CREATE_CAROUSEL_REQUEST:
      return { ...state, loading: true };
    case ADMIN_CREATE_CAROUSEL_SUCCESS:
      return { loading: false, carousel: action.payload };
    case ADMIN_CREATE_CAROUSEL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const carouselListReducer = (state = { carousels: [] }, action) => {
  switch (action.type) {
    case CAROUSEL_LIST_REQUEST:
      return { loading: true };
    case CAROUSEL_LIST_SUCCESS:
      return { loading: false, carousels: action.payload };
    case CAROUSEL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const carouselDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_DELETE_CAROUSEL_REQUEST:
      return { loading: true };
    case ADMIN_DELETE_CAROUSEL_SUCCESS:
      return { loading: false, success: true };
    case ADMIN_DELETE_CAROUSEL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const carouselDetailsReducer = (state = { carousel: {} }, action) => {
  switch (action.type) {
    case ADMIN_CAROUSEL_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ADMIN_CAROUSEL_DETAILS_SUCCESS:
      return { loading: false, carousel: action.payload };
    case ADMIN_CAROUSEL_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const carouselUpdateReducer = (state = { carousel: {} }, action) => {
  switch (action.type) {
    case ADMIN_UPDATE_CAROUSEL_REQUEST:
      return { loading: true };
    case ADMIN_UPDATE_CAROUSEL_SUCCESS:
      return { loading: false, success: true };
    case ADMIN_UPDATE_CAROUSEL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

import {
  CREATE_STORE_REQUEST,
  CREATE_STORE_SUCCESS,
  CREATE_STORE_FAIL,
  CREATE_STORE_RESET,
  STORE_DETAILS_REQUEST,
  STORE_DETAILS_SUCCESS,
  STORE_DETAILS_FAIL,
  STORE_DETAILS_RESET,
  STORE_LIST_REQUEST,
  STORE_LIST_SUCCESS,
  STORE_LIST_FAIL,
  STORE_LIST_RESET,
  STORE_UPDATE_REQUEST,
  STORE_UPDATE_SUCCESS,
  STORE_UPDATE_FAIL,
  STORE_UPDATE_RESET,
  STORE_DELETE_REQUEST,
  STORE_DELETE_SUCCESS,
  STORE_DELETE_FAIL,
} from "../constants/store.constants";

export const createStoreReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_STORE_REQUEST:
      return { loading: true };
    case CREATE_STORE_SUCCESS:
      return { loading: false, store: action.payload, status: true };
    case CREATE_STORE_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_STORE_RESET:
      return {};
    default:
      return state;
  }
};

export const storeDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_DETAILS_REQUEST:
      return { loading: true };
    case STORE_DETAILS_SUCCESS:
      return { loading: false, store: action.payload };
    case STORE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case STORE_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const storeListReducer = (state = [], action) => {
  switch (action.type) {
    case STORE_LIST_REQUEST:
      return { loading: true };
    case STORE_LIST_SUCCESS:
      return { loadin: false, stores: action.payload };
    case STORE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case STORE_LIST_RESET:
      return [];
    default:
      return state;
  }
};

export const storeUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_UPDATE_REQUEST:
      return { loading: true };
    case STORE_UPDATE_SUCCESS:
      return { loading: false, store: action.payload, success: true };
    case STORE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case STORE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const storeDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_DELETE_REQUEST:
      return { loading: true };
    case STORE_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload.message };
    case STORE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

import {
  CREATE_ITEM_REQUEST,
  CREATE_ITEM_SUCCESS,
  CREATE_ITEM_FAIL,
  CREATE_ITEM_RESET,
  ITEM_DETAILS_REQUEST,
  ITEM_DETAILS_SUCCESS,
  ITEM_DETAILS_FAIL,
  ITEM_DETAILS_RESET,
  ITEM_LIST_REQUEST,
  ITEM_LIST_SUCCESS,
  ITEM_LIST_FAIL,
  ITEM_LIST_RESET,
  ITEM_UPDATE_REQUEST,
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_FAIL,
  ITEM_UPDATE_RESET,
  ITEM_DELETE_FAIL,
  ITEM_DELETE_REQUEST,
  ITEM_DELETE_SUCCESS,
  ITEM_ADD_REQUEST,
  ITEM_ADD_SUCCESS,
  ITEM_ADD_FAIL,
  ITEM_ADD_RESET,
  ITEM_REMOVE_REQUEST,
  ITEM_REMOVE_SUCCESS,
  ITEM_REMOVE_FAIL,
  ITEM_REMOVE_RESET,
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

export const createItemReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ITEM_REQUEST:
      return { loading: true };
    case CREATE_ITEM_SUCCESS:
      return { loading: false, item: action.payload, status: true };
    case CREATE_ITEM_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_ITEM_RESET:
      return {};
    default:
      return state;
  }
};

export const itemDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case ITEM_DETAILS_REQUEST:
      return { loading: true };
    case ITEM_DETAILS_SUCCESS:
      return { loading: false, item: action.payload };
    case ITEM_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case ITEM_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const itemListReducer = (state = [], action) => {
  switch (action.type) {
    case ITEM_LIST_REQUEST:
      return { loading: true };
    case ITEM_LIST_SUCCESS:
      return { loadin: false, items: action.payload };
    case ITEM_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ITEM_LIST_RESET:
      return [];
    default:
      return state;
  }
};

export const itemUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case ITEM_UPDATE_REQUEST:
      return { loading: true };
    case ITEM_UPDATE_SUCCESS:
      return { loading: false, item: action.payload, success: true };
    case ITEM_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case ITEM_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const itemDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ITEM_DELETE_REQUEST:
      return { loading: true };
    case ITEM_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload.message };
    case ITEM_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addToItemReducer = (state = {}, action) => {
  switch (action.type) {
    case ITEM_ADD_REQUEST:
      return { loading: true };
    case ITEM_ADD_SUCCESS:
      return { loading: false, item: action.payload, status: true };
    case ITEM_ADD_FAIL:
      return { loading: false, error: action.payload };
    case ITEM_ADD_RESET:
      return {};
    default:
      return state;
  }
};

export const removeFromItemReducer = (state = {}, action) => {
  switch (action.type) {
    case ITEM_REMOVE_REQUEST:
      return { loading: true };
    case ITEM_REMOVE_SUCCESS:
      return { loading: false, item: action.payload, status: true };
    case ITEM_REMOVE_FAIL:
      return { loading: false, error: action.payload };
    case ITEM_REMOVE_RESET:
      return {};
    default:
      return state;
  }
};

export const itemOfTheDayReducer = (state = [], action) => {
  switch (action.type) {
    case ITEM_OF_THE_DAY_REQUEST:
      return { loading: true };
    case ITEM_OF_THE_DAY_SUCCESS:
      return { loadin: false, item: action.payload };
    case ITEM_OF_THE_DAY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const favoriteItemReducer = (state = {}, action) => {
  switch (action.type) {
    case ITEM_FAVORITE_REQUEST:
      return { loading: true };
    case ITEM_FAVORITE_SUCCESS:
      return { loading: false, success: true };
    case ITEM_FAVORITE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const unfavoriteItemReducer = (state = {}, action) => {
  switch (action.type) {
    case ITEM_UNFAVORITE_REQUEST:
      return { loading: true };
    case ITEM_UNFAVORITE_SUCCESS:
      return { loading: false, success: true };
    case ITEM_UNFAVORITE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

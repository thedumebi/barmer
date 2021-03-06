import {
  REQUEST_CREATE_REQUEST,
  REQUEST_CREATE_SUCCESS,
  REQUEST_CREATE_FAIL,
  REQUEST_CREATE_RESET,
  REQUEST_ACCEPT_REQUEST,
  REQUEST_ACCEPT_SUCCESS,
  REQUEST_ACCEPT_FAIL,
  REQUEST_ACCEPT_RESET,
  REQUEST_DELETE_REQUEST,
  REQUEST_DELETE_SUCCESS,
  REQUEST_DELETE_FAIL,
  REQUEST_DETAILS_REQUEST,
  REQUEST_DETAILS_SUCCESS,
  REQUEST_DETAILS_FAIL,
  REQUEST_DETAILS_RESET,
  REQUEST_REJECT_REQUEST,
  REQUEST_REJECT_SUCCESS,
  REQUEST_REJECT_FAIL,
  REQUEST_REJECT_RESET,
  REQUEST_UPDATE_REQUEST,
  REQUEST_UPDATE_SUCCESS,
  REQUEST_UPDATE_FAIL,
  REQUEST_UPDATE_RESET,
  RECEIVED_REQUEST_LIST_REQUEST,
  RECEIVED_REQUEST_LIST_SUCCESS,
  RECEIVED_REQUEST_LIST_FAIL,
  RECEIVED_REQUEST_LIST_RESET,
  SENT_REQUEST_LIST_REQUEST,
  SENT_REQUEST_LIST_SUCCESS,
  SENT_REQUEST_LIST_FAIL,
  SENT_REQUEST_LIST_RESET,
} from "../constants/request.constants";

export const createRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_CREATE_REQUEST:
      return { loading: true };
    case REQUEST_CREATE_SUCCESS:
      return { loading: false, status: true };
    case REQUEST_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const requestDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_DETAILS_REQUEST:
      return { loading: true };
    case REQUEST_DETAILS_SUCCESS:
      return { loading: false, request: action.payload };
    case REQUEST_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const sentRequestListReducer = (state = [], action) => {
  switch (action.type) {
    case SENT_REQUEST_LIST_REQUEST:
      return { loading: true };
    case SENT_REQUEST_LIST_SUCCESS:
      return { loadin: false, requests: action.payload };
    case SENT_REQUEST_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SENT_REQUEST_LIST_RESET:
      return [];
    default:
      return state;
  }
};

export const receivedRequestListReducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVED_REQUEST_LIST_REQUEST:
      return { loading: true };
    case RECEIVED_REQUEST_LIST_SUCCESS:
      return { loadin: false, requests: action.payload };
    case RECEIVED_REQUEST_LIST_FAIL:
      return { loading: false, error: action.payload };
    case RECEIVED_REQUEST_LIST_RESET:
      return [];
    default:
      return state;
  }
};

export const requestUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_UPDATE_REQUEST:
      return { loading: true };
    case REQUEST_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case REQUEST_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const requestDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_DELETE_REQUEST:
      return { loading: true };
    case REQUEST_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload.message };
    case REQUEST_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const requestAcceptReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_ACCEPT_REQUEST:
      return { loading: true };
    case REQUEST_ACCEPT_SUCCESS:
      return { loading: false, status: true };
    case REQUEST_ACCEPT_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_ACCEPT_RESET:
      return {};
    default:
      return state;
  }
};

export const requestRejectReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_REJECT_REQUEST:
      return { loading: true };
    case REQUEST_REJECT_SUCCESS:
      return { loading: false, status: true };
    case REQUEST_REJECT_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_REJECT_RESET:
      return {};
    default:
      return state;
  }
};

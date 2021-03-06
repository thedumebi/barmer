import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/user.reducers";
import {
  createStoreReducer,
  storeDeleteReducer,
  storeDetailsReducer,
  storeListReducer,
  storeUpdateReducer,
} from "./reducers/store.reducers";
import {
  addToItemReducer,
  createItemReducer,
  favoriteItemReducer,
  itemDeleteReducer,
  itemDetailsReducer,
  itemListReducer,
  itemOfTheDayReducer,
  itemUpdateReducer,
  removeFromItemReducer,
  unfavoriteItemReducer,
} from "./reducers/item.reducers";
import {
  carouselDeleteReducer,
  carouselDetailsReducer,
  carouselListReducer,
  carouselUpdateReducer,
  createCarouselReducer,
} from "./reducers/carousel.reducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  createStore: createStoreReducer,
  storeDetails: storeDetailsReducer,
  storeList: storeListReducer,
  storeUpdate: storeUpdateReducer,
  storeDelete: storeDeleteReducer,
  createItem: createItemReducer,
  itemDetails: itemDetailsReducer,
  itemList: itemListReducer,
  itemUpdate: itemUpdateReducer,
  itemDelete: itemDeleteReducer,
  itemAdd: addToItemReducer,
  itemRemove: removeFromItemReducer,
  itemFavorite: favoriteItemReducer,
  itemUnfavorite: unfavoriteItemReducer,
  itemOfTheDay: itemOfTheDayReducer,
  createCarousel: createCarouselReducer,
  carouselList: carouselListReducer,
  carouselDelete: carouselDeleteReducer,
  carouselDetails: carouselDetailsReducer,
  carouselUpate: carouselUpdateReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

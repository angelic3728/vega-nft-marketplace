import { combineReducers } from 'redux';
import authReducer from './authentications'
import nftReducer from './nfts';
import hotCollectionsReducer from './hotCollections';
import authorListReducer from './authorList';
import filterReducer from './filters';
import blogPostsReducer from './blogs';

export const rootReducer = combineReducers({
  auth: authReducer,
  NFT: nftReducer,
  hotCollection: hotCollectionsReducer,
  authors: authorListReducer,
  filters: filterReducer,
  blogs: blogPostsReducer
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;

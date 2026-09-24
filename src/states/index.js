import { configureStore } from '@reduxjs/toolkit'
import loadingBarReducer from './loadingBar/reducer'
import authUserReducer from './authUser/reducer'
import usersReducer from './users/reducer'
import threadsReducer from './threads/reducer'
import threadDetailReducer from './threadDetail/reducer'
import leaderboardsReducer from './leaderboards/reducer'
import isPreloadReducer from './isPreload/reducer'
import bookmarksReducer from './bookmarks/reducer'

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    bookmarks: bookmarksReducer,
    isPreload: isPreloadReducer,
    loadingBar: loadingBarReducer
  }
})

export default store

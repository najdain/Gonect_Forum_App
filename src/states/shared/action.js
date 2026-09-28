import api from '../../utils/api'
import { receiveUsersActionCreator } from '../users/action'
import { receiveThreadsActionCreator } from '../threads/action'
import { receiveLeaderboardsActionCreator } from '../leaderboards/action'
import { showLoading, hideLoading } from '../loadingBar/action'

// Thunk ambil data pengguna, utas, dan klasemen
function asyncPopulateUsersAndThreads() {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      const [users, threads, leaderboards] = await Promise.all([
        api.getAllUsers(),
        api.getAllThreads(),
        api.getLeaderboards()
      ])

      dispatch(receiveUsersActionCreator(users || []))
      dispatch(receiveThreadsActionCreator(threads || []))
      if (leaderboards) {
        dispatch(receiveLeaderboardsActionCreator(leaderboards))
      }
    } catch (error) {
      alert(error.message)
    } finally {
      dispatch(hideLoading())
    }
  }
}

export { asyncPopulateUsersAndThreads }

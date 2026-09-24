import api from '../../utils/api'
import { showLoading, hideLoading } from '../loadingBar/action'

const ActionType = {
  RECEIVE_LEADERBOARDS: 'RECEIVE_LEADERBOARDS',
  INCREMENT_USER_SCORE: 'INCREMENT_USER_SCORE'
}

function receiveLeaderboardsActionCreator(leaderboards) {
  return {
    type: ActionType.RECEIVE_LEADERBOARDS,
    payload: {
      leaderboards
    }
  }
}

function incrementUserScoreActionCreator({ user, points = 10 }) {
  return {
    type: ActionType.INCREMENT_USER_SCORE,
    payload: {
      user,
      points
    }
  }
}

function asyncReceiveLeaderboards() {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      const leaderboards = await api.getLeaderboards()
      dispatch(receiveLeaderboardsActionCreator(leaderboards))
    } catch (error) {
      console.error(error.message)
    } finally {
      dispatch(hideLoading())
    }
  }
}

export {
  ActionType,
  receiveLeaderboardsActionCreator,
  incrementUserScoreActionCreator,
  asyncReceiveLeaderboards
}

import api from '../../utils/api'
import { setAuthUserActionCreator } from '../authUser/action'
import { showLoading, hideLoading } from '../loadingBar/action'

const ActionType = {
  SET_IS_PRELOAD: 'SET_IS_PRELOAD'
}

function setIsPreloadActionCreator(isPreload) {
  return {
    type: ActionType.SET_IS_PRELOAD,
    payload: {
      isPreload
    }
  }
}

function asyncPreloadProcess() {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      const authUser = await api.getOwnProfile()
      let finalUser = authUser
      if (authUser) {
        try {
          const saved = localStorage.getItem(`gonect_profile_${authUser.id}`)
          if (saved) {
            finalUser = { ...authUser, ...JSON.parse(saved) }
          }
        } catch (e) {
          // ignore error
        }
      }
      dispatch(setAuthUserActionCreator(finalUser))
    } catch (error) {
      dispatch(setAuthUserActionCreator(null))
    } finally {
      dispatch(setIsPreloadActionCreator(false))
      dispatch(hideLoading())
    }
  }
}

export {
  ActionType,
  setIsPreloadActionCreator,
  asyncPreloadProcess
}

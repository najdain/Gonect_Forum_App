import api from '../../utils/api'
import { showLoading, hideLoading } from '../loadingBar/action'

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
  UPDATE_AUTH_USER: 'UPDATE_AUTH_USER'
}

function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser
    }
  }
}

function updateAuthUserActionCreator(updatedData) {
  return {
    type: ActionType.UPDATE_AUTH_USER,
    payload: {
      updatedData
    }
  }
}

function unsetAuthUserActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_USER
  }
}

function asyncSetAuthUser({ email, password }) {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      const token = await api.login({ email, password })
      api.putAccessToken(token)
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
      alert(error.message)
      throw error
    } finally {
      dispatch(hideLoading())
    }
  }
}

function asyncUnsetAuthUser() {
  return (dispatch) => {
    dispatch(unsetAuthUserActionCreator())
    api.putAccessToken('')
  }
}

export {
  ActionType,
  setAuthUserActionCreator,
  updateAuthUserActionCreator,
  unsetAuthUserActionCreator,
  asyncSetAuthUser,
  asyncUnsetAuthUser
}

import { ActionType } from './action'

function authUserReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_AUTH_USER: {
      const authUser = action.payload.authUser
      if (!authUser) return null
      try {
        const saved = localStorage.getItem(`gonect_profile_${authUser.id}`)
        if (saved) {
          return { ...authUser, ...JSON.parse(saved) }
        }
      } catch (e) {
        // ignore JSON parse error
      }
      return authUser
    }
    case ActionType.UPDATE_AUTH_USER:
      return state ? { ...state, ...action.payload.updatedData } : state
    case ActionType.UNSET_AUTH_USER:
      return null
    default:
      return state
  }
}

export default authUserReducer

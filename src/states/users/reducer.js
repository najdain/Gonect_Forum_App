import { ActionType } from './action'

function usersReducer(state = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_USERS:
      return (action.payload.users || []).map((u) => {
        try {
          const saved = localStorage.getItem(`gonect_profile_${u.id}`)
          if (saved) {
            return { ...u, ...JSON.parse(saved) }
          }
        } catch (e) {
          // ignore
        }
        return u
      })
    case ActionType.UPDATE_USER:
      return state.map((u) => (u.id === action.payload.user.id ? { ...u, ...action.payload.user } : u))
    default:
      return state
  }
}

export default usersReducer

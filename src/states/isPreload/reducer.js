import { ActionType } from './action'

function isPreloadReducer(state = true, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_PRELOAD:
      return action.payload.isPreload
    default:
      return state
  }
}

export default isPreloadReducer

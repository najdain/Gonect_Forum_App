import { ActionType } from './action'

function loadingBarReducer(state = { default: 0 }, action = {}) {
  switch (action.type) {
    case ActionType.SHOW_LOADING:
    case 'loading-bar/SHOW':
      return { default: (state.default || 0) + 1 }
    case ActionType.HIDE_LOADING:
    case 'loading-bar/HIDE':
      return { default: Math.max(0, (state.default || 1) - 1) }
    case ActionType.RESET_LOADING:
    case 'loading-bar/RESET':
      return { default: 0 }
    default:
      return state
  }
}

export default loadingBarReducer

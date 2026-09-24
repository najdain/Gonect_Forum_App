import { ActionType } from './action'

function threadsReducer(state = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...state]
    case ActionType.UPDATE_THREAD_VOTES:
      return state.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            upVotesBy: action.payload.upVotesBy,
            downVotesBy: action.payload.downVotesBy
          }
        }
        return thread
      })
    case ActionType.DELETE_THREAD:
      return state.filter((thread) => thread.id !== action.payload.threadId)
    case ActionType.EDIT_THREAD:
      return state.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            title: action.payload.title,
            body: action.payload.body,
            category: action.payload.category
          }
        }
        return thread
      })
    case ActionType.TOGGLE_REPOST_THREAD:
      return state.map((thread) => {
        if (thread.id === action.payload.threadId) {
          const repostsBy = thread.repostsBy || []
          const isReposted = repostsBy.includes(action.payload.userId)
          const newRepostsBy = isReposted
            ? repostsBy.filter((id) => id !== action.payload.userId)
            : [...repostsBy, action.payload.userId]
          return {
            ...thread,
            repostsBy: newRepostsBy
          }
        }
        return thread
      })
    default:
      return state
  }
}

export default threadsReducer

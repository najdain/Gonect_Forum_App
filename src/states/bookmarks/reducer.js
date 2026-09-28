import { ActionType } from './action'

// Ambil bookmark dari localStorage
function getInitialBookmarks() {
  try {
    const saved = localStorage.getItem('gonect_bookmarks')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    return []
  }
}

// Reducer daftar bookmark
function bookmarksReducer(state = getInitialBookmarks(), action = {}) {
  switch (action.type) {
    // Toggle bookmark dan sinkron ke localStorage
    case ActionType.TOGGLE_BOOKMARK: {
      const { threadId } = action.payload
      const exists = state.includes(threadId)
      let nextState
      if (exists) {
        nextState = state.filter((id) => id !== threadId)
      } else {
        nextState = [...state, threadId]
      }
      try {
        localStorage.setItem('gonect_bookmarks', JSON.stringify(nextState))
      } catch (e) {
      }
      return nextState
    }
    default:
      return state
  }
}

export default bookmarksReducer

import { ActionType } from './action'

// Reducer untuk mengelola state daftar utas
function threadsReducer(state = [], action = {}) {
  switch (action.type) {
    // Simpan semua utas
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads
    // Tambah utas baru ke urutan teratas
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...state]
    // Perbarui array vote utas
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
    // Hapus utas dari daftar
    case ActionType.DELETE_THREAD:
      return state.filter((thread) => thread.id !== action.payload.threadId)
    // Perbarui judul/konten utas
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
    // Toggle status repost pengguna
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

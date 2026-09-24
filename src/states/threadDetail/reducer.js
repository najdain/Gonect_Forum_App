import { ActionType } from './action'

function threadDetailReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREAD_DETAIL:
      return action.payload.detailThread
    case ActionType.CLEAR_THREAD_DETAIL:
      return null
    case ActionType.ADD_COMMENT:
      return {
        ...state,
        comments: [action.payload.comment, ...state.comments]
      }
    case ActionType.UPDATE_DETAIL_THREAD_VOTES:
      return {
        ...state,
        upVotesBy: action.payload.upVotesBy,
        downVotesBy: action.payload.downVotesBy
      }
    case ActionType.UPDATE_COMMENT_VOTES:
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.commentId) {
            return {
              ...comment,
              upVotesBy: action.payload.upVotesBy,
              downVotesBy: action.payload.downVotesBy
            }
          }
          return comment
        })
      }
    case ActionType.DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter((comment) => comment.id !== action.payload.commentId)
      }
    case ActionType.EDIT_COMMENT:
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.commentId) {
            return {
              ...comment,
              content: action.payload.content
            }
          }
          return comment
        })
      }
    case ActionType.EDIT_THREAD_DETAIL:
      return {
        ...state,
        title: action.payload.title,
        body: action.payload.body,
        category: action.payload.category
      }
    default:
      return state
  }
}

export default threadDetailReducer

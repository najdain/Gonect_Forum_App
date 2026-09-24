import api from '../../utils/api'
import { showLoading, hideLoading } from '../loadingBar/action'

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  ADD_COMMENT: 'ADD_COMMENT',
  UPDATE_DETAIL_THREAD_VOTES: 'UPDATE_DETAIL_THREAD_VOTES',
  UPDATE_COMMENT_VOTES: 'UPDATE_COMMENT_VOTES',
  DELETE_COMMENT: 'DELETE_COMMENT',
  EDIT_COMMENT: 'EDIT_COMMENT',
  EDIT_THREAD_DETAIL: 'EDIT_THREAD_DETAIL'
}

function receiveThreadDetailActionCreator(detailThread) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      detailThread
    }
  }
}

function clearThreadDetailActionCreator() {
  return {
    type: ActionType.CLEAR_THREAD_DETAIL
  }
}

function addCommentActionCreator(comment) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      comment
    }
  }
}

function updateDetailThreadVotesActionCreator({ upVotesBy, downVotesBy }) {
  return {
    type: ActionType.UPDATE_DETAIL_THREAD_VOTES,
    payload: {
      upVotesBy,
      downVotesBy
    }
  }
}

function updateCommentVotesActionCreator({ commentId, upVotesBy, downVotesBy }) {
  return {
    type: ActionType.UPDATE_COMMENT_VOTES,
    payload: {
      commentId,
      upVotesBy,
      downVotesBy
    }
  }
}

function deleteCommentActionCreator(commentId) {
  return {
    type: ActionType.DELETE_COMMENT,
    payload: {
      commentId
    }
  }
}

function editCommentActionCreator({ commentId, content }) {
  return {
    type: ActionType.EDIT_COMMENT,
    payload: {
      commentId,
      content
    }
  }
}

function editThreadDetailActionCreator({ title, body, category }) {
  return {
    type: ActionType.EDIT_THREAD_DETAIL,
    payload: {
      title,
      body,
      category
    }
  }
}

function asyncDeleteComment(commentId) {
  return async (dispatch) => {
    dispatch(deleteCommentActionCreator(commentId))
  }
}

function asyncEditComment({ commentId, content }) {
  return async (dispatch) => {
    dispatch(editCommentActionCreator({ commentId, content }))
  }
}

function asyncEditThreadDetail({ title, body, category }) {
  return async (dispatch) => {
    dispatch(editThreadDetailActionCreator({ title, body, category }))
  }
}

function asyncGetThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(showLoading())
    dispatch(clearThreadDetailActionCreator())

    try {
      const detailThread = await api.getThreadDetail(threadId)
      dispatch(receiveThreadDetailActionCreator(detailThread))
    } catch (error) {
      alert(error.message)
    } finally {
      dispatch(hideLoading())
    }
  }
}

function asyncCreateComment({ threadId, content }) {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      const comment = await api.createComment({ threadId, content })
      dispatch(addCommentActionCreator(comment))
      return comment
    } catch (error) {
      alert(error.message)
      throw error
    } finally {
      dispatch(hideLoading())
    }
  }
}

function asyncToggleUpvoteDetailThread() {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState()
    if (!authUser) {
      alert('You must log in to vote')
      return
    }

    if (!threadDetail) return

    const originalUpVotes = [...threadDetail.upVotesBy]
    const originalDownVotes = [...threadDetail.downVotesBy]

    let newUpVotes = [...threadDetail.upVotesBy]
    let newDownVotes = [...threadDetail.downVotesBy]

    const isUpvoted = newUpVotes.includes(authUser.id)
    const isDownvoted = newDownVotes.includes(authUser.id)

    if (isUpvoted) {
      newUpVotes = newUpVotes.filter((id) => id !== authUser.id)
    } else {
      newUpVotes.push(authUser.id)
      if (isDownvoted) {
        newDownVotes = newDownVotes.filter((id) => id !== authUser.id)
      }
    }

    dispatch(updateDetailThreadVotesActionCreator({ upVotesBy: newUpVotes, downVotesBy: newDownVotes }))

    try {
      if (isUpvoted) {
        await api.neutralizeThreadVote(threadDetail.id)
      } else {
        await api.upVoteThread(threadDetail.id)
      }
    } catch (error) {
      dispatch(updateDetailThreadVotesActionCreator({ upVotesBy: originalUpVotes, downVotesBy: originalDownVotes }))
    }
  }
}

function asyncToggleDownvoteDetailThread() {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState()
    if (!authUser) {
      alert('You must log in to vote')
      return
    }

    if (!threadDetail) return

    const originalUpVotes = [...threadDetail.upVotesBy]
    const originalDownVotes = [...threadDetail.downVotesBy]

    let newUpVotes = [...threadDetail.upVotesBy]
    let newDownVotes = [...threadDetail.downVotesBy]

    const isUpvoted = newUpVotes.includes(authUser.id)
    const isDownvoted = newDownVotes.includes(authUser.id)

    if (isDownvoted) {
      newDownVotes = newDownVotes.filter((id) => id !== authUser.id)
    } else {
      newDownVotes.push(authUser.id)
      if (isUpvoted) {
        newUpVotes = newUpVotes.filter((id) => id !== authUser.id)
      }
    }

    dispatch(updateDetailThreadVotesActionCreator({ upVotesBy: newUpVotes, downVotesBy: newDownVotes }))

    try {
      if (isDownvoted) {
        await api.neutralizeThreadVote(threadDetail.id)
      } else {
        await api.downVoteThread(threadDetail.id)
      }
    } catch (error) {
      dispatch(updateDetailThreadVotesActionCreator({ upVotesBy: originalUpVotes, downVotesBy: originalDownVotes }))
    }
  }
}

function asyncToggleUpvoteComment(commentId) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState()
    if (!authUser) {
      alert('You must log in to vote')
      return
    }

    const comment = threadDetail.comments.find((c) => c.id === commentId)
    if (!comment) return

    const originalUpVotes = [...comment.upVotesBy]
    const originalDownVotes = [...comment.downVotesBy]

    let newUpVotes = [...comment.upVotesBy]
    let newDownVotes = [...comment.downVotesBy]

    const isUpvoted = newUpVotes.includes(authUser.id)
    const isDownvoted = newDownVotes.includes(authUser.id)

    if (isUpvoted) {
      newUpVotes = newUpVotes.filter((id) => id !== authUser.id)
    } else {
      newUpVotes.push(authUser.id)
      if (isDownvoted) {
        newDownVotes = newDownVotes.filter((id) => id !== authUser.id)
      }
    }

    dispatch(updateCommentVotesActionCreator({ commentId, upVotesBy: newUpVotes, downVotesBy: newDownVotes }))

    try {
      if (isUpvoted) {
        await api.neutralizeCommentVote({ threadId: threadDetail.id, commentId })
      } else {
        await api.upVoteComment({ threadId: threadDetail.id, commentId })
      }
    } catch (error) {
      dispatch(updateCommentVotesActionCreator({ commentId, upVotesBy: originalUpVotes, downVotesBy: originalDownVotes }))
    }
  }
}

function asyncToggleDownvoteComment(commentId) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState()
    if (!authUser) {
      alert('You must log in to vote')
      return
    }

    const comment = threadDetail.comments.find((c) => c.id === commentId)
    if (!comment) return

    const originalUpVotes = [...comment.upVotesBy]
    const originalDownVotes = [...comment.downVotesBy]

    let newUpVotes = [...comment.upVotesBy]
    let newDownVotes = [...comment.downVotesBy]

    const isDownvoted = newDownVotes.includes(authUser.id)
    const isUpvoted = newUpVotes.includes(authUser.id)

    if (isDownvoted) {
      newDownVotes = newDownVotes.filter((id) => id !== authUser.id)
    } else {
      newDownVotes.push(authUser.id)
      if (isUpvoted) {
        newUpVotes = newUpVotes.filter((id) => id !== authUser.id)
      }
    }

    dispatch(updateCommentVotesActionCreator({ commentId, upVotesBy: newUpVotes, downVotesBy: newDownVotes }))

    try {
      if (isDownvoted) {
        await api.neutralizeCommentVote({ threadId: threadDetail.id, commentId })
      } else {
        await api.downVoteComment({ threadId: threadDetail.id, commentId })
      }
    } catch (error) {
      dispatch(updateCommentVotesActionCreator({ commentId, upVotesBy: originalUpVotes, downVotesBy: originalDownVotes }))
    }
  }
}

export {
  ActionType,
  receiveThreadDetailActionCreator,
  clearThreadDetailActionCreator,
  addCommentActionCreator,
  updateDetailThreadVotesActionCreator,
  updateCommentVotesActionCreator,
  deleteCommentActionCreator,
  editCommentActionCreator,
  editThreadDetailActionCreator,
  asyncGetThreadDetail,
  asyncCreateComment,
  asyncToggleUpvoteDetailThread,
  asyncToggleDownvoteDetailThread,
  asyncToggleUpvoteComment,
  asyncToggleDownvoteComment,
  asyncDeleteComment,
  asyncEditComment,
  asyncEditThreadDetail
}

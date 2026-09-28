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

// Action simpan detail utas
function receiveThreadDetailActionCreator(detailThread) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      detailThread
    }
  }
}

// Action kosongkan detail utas
function clearThreadDetailActionCreator() {
  return {
    type: ActionType.CLEAR_THREAD_DETAIL
  }
}

// Action tambah komentar baru
function addCommentActionCreator(comment) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      comment
    }
  }
}

// Action perbarui vote detail utas
function updateDetailThreadVotesActionCreator({ upVotesBy, downVotesBy }) {
  return {
    type: ActionType.UPDATE_DETAIL_THREAD_VOTES,
    payload: {
      upVotesBy,
      downVotesBy
    }
  }
}

// Action perbarui vote komentar
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

// Action hapus komentar
function deleteCommentActionCreator(commentId) {
  return {
    type: ActionType.DELETE_COMMENT,
    payload: {
      commentId
    }
  }
}

// Action edit isi komentar
function editCommentActionCreator({ commentId, content }) {
  return {
    type: ActionType.EDIT_COMMENT,
    payload: {
      commentId,
      content
    }
  }
}

// Action edit detail utas
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

// Thunk hapus komentar
function asyncDeleteComment(commentId) {
  return async (dispatch) => {
    dispatch(deleteCommentActionCreator(commentId))
  }
}

// Thunk edit komentar
function asyncEditComment({ commentId, content }) {
  return async (dispatch) => {
    dispatch(editCommentActionCreator({ commentId, content }))
  }
}

// Thunk edit detail utas
function asyncEditThreadDetail({ title, body, category }) {
  return async (dispatch) => {
    dispatch(editThreadDetailActionCreator({ title, body, category }))
  }
}

// Thunk ambil detail utas dari API
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

// Thunk kirim komentar baru
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

// Thunk toggle upvote detail utas
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

// Thunk toggle downvote detail utas
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

// Thunk toggle upvote komentar
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

// Thunk toggle downvote komentar
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

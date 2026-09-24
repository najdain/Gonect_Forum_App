import api from '../../utils/api'
import { showLoading, hideLoading } from '../loadingBar/action'
import { incrementUserScoreActionCreator } from '../leaderboards/action'

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  UPDATE_THREAD_VOTES: 'UPDATE_THREAD_VOTES',
  DELETE_THREAD: 'DELETE_THREAD',
  EDIT_THREAD: 'EDIT_THREAD',
  TOGGLE_REPOST_THREAD: 'TOGGLE_REPOST_THREAD'
}

function receiveThreadsActionCreator(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads
    }
  }
}

function addThreadActionCreator(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread
    }
  }
}

function updateThreadVotesActionCreator({ threadId, upVotesBy, downVotesBy }) {
  return {
    type: ActionType.UPDATE_THREAD_VOTES,
    payload: {
      threadId,
      upVotesBy,
      downVotesBy
    }
  }
}

function deleteThreadActionCreator(threadId) {
  return {
    type: ActionType.DELETE_THREAD,
    payload: {
      threadId
    }
  }
}

function editThreadActionCreator({ threadId, title, body, category }) {
  return {
    type: ActionType.EDIT_THREAD,
    payload: {
      threadId,
      title,
      body,
      category
    }
  }
}

function asyncAddThread({ title, body, category }) {
  return async (dispatch, getState) => {
    dispatch(showLoading())
    try {
      const thread = await api.createThread({ title, body, category })
      dispatch(addThreadActionCreator(thread))
      const { authUser } = getState()
      if (authUser) {
        dispatch(incrementUserScoreActionCreator({ user: authUser, points: 10 }))
      }
      return thread
    } catch (error) {
      console.error(error.message)
      throw error
    } finally {
      dispatch(hideLoading())
    }
  }
}

function asyncToggleUpvoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threads } = getState()
    if (!authUser) {
      alert('You must log in to vote')
      return
    }

    const thread = threads.find((t) => t.id === threadId)
    if (!thread) return

    const originalUpVotes = [...thread.upVotesBy]
    const originalDownVotes = [...thread.downVotesBy]

    let newUpVotes = [...thread.upVotesBy]
    let newDownVotes = [...thread.downVotesBy]

    const isUpvoted = newUpVotes.includes(authUser.id)
    const isDownvoted = newDownVotes.includes(authUser.id)

    if (isUpvoted) {
      // If already upvoted, neutralize it
      newUpVotes = newUpVotes.filter((id) => id !== authUser.id)
      dispatch(incrementUserScoreActionCreator({ user: authUser, points: -10 }))
    } else {
      // If not upvoted, add to upvotes and remove from downvotes
      newUpVotes.push(authUser.id)
      dispatch(incrementUserScoreActionCreator({ user: authUser, points: 10 }))
      if (isDownvoted) {
        newDownVotes = newDownVotes.filter((id) => id !== authUser.id)
      }
    }

    // Optimistically update
    dispatch(updateThreadVotesActionCreator({ threadId, upVotesBy: newUpVotes, downVotesBy: newDownVotes }))

    try {
      if (isUpvoted) {
        await api.neutralizeThreadVote(threadId)
      } else {
        await api.upVoteThread(threadId)
      }
    } catch (error) {
      if (error.message !== 'thread is not exist') {
        alert(error.message)
        dispatch(updateThreadVotesActionCreator({ threadId, upVotesBy: originalUpVotes, downVotesBy: originalDownVotes }))
      }
    }
  }
}

function asyncToggleDownvoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threads } = getState()
    if (!authUser) {
      alert('You must log in to vote')
      return
    }

    const thread = threads.find((t) => t.id === threadId)
    if (!thread) return

    const originalUpVotes = [...thread.upVotesBy]
    const originalDownVotes = [...thread.downVotesBy]

    let newUpVotes = [...thread.upVotesBy]
    let newDownVotes = [...thread.downVotesBy]

    const isUpvoted = newUpVotes.includes(authUser.id)
    const isDownvoted = newDownVotes.includes(authUser.id)

    if (isDownvoted) {
      // If already downvoted, neutralize it
      newDownVotes = newDownVotes.filter((id) => id !== authUser.id)
      dispatch(incrementUserScoreActionCreator({ user: authUser, points: 5 }))
    } else {
      // If not downvoted, add to downvotes and remove from upvotes
      newDownVotes.push(authUser.id)
      dispatch(incrementUserScoreActionCreator({ user: authUser, points: -5 }))
      if (isUpvoted) {
        newUpVotes = newUpVotes.filter((id) => id !== authUser.id)
      }
    }

    // Optimistically update
    dispatch(updateThreadVotesActionCreator({ threadId, upVotesBy: newUpVotes, downVotesBy: newDownVotes }))

    try {
      if (isDownvoted) {
        await api.neutralizeThreadVote(threadId)
      } else {
        await api.downVoteThread(threadId)
      }
    } catch (error) {
      if (error.message !== 'thread is not exist') {
        alert(error.message)
        dispatch(updateThreadVotesActionCreator({ threadId, upVotesBy: originalUpVotes, downVotesBy: originalDownVotes }))
      }
    }
  }
}

function toggleRepostThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_REPOST_THREAD,
    payload: {
      threadId,
      userId
    }
  }
}

function asyncToggleRepostThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser } = getState()
    if (!authUser) {
      alert('You must log in to repost')
      return
    }

    dispatch(toggleRepostThreadActionCreator({ threadId, userId: authUser.id }))
    dispatch(incrementUserScoreActionCreator({ user: authUser, points: 5 }))
  }
}

function asyncDeleteThread(threadId) {
  return async (dispatch) => {
    dispatch(deleteThreadActionCreator(threadId))
  }
}

function asyncEditThread({ threadId, title, body, category }) {
  return async (dispatch) => {
    dispatch(editThreadActionCreator({ threadId, title, body, category }))
  }
}

export {
  ActionType,
  receiveThreadsActionCreator,
  addThreadActionCreator,
  updateThreadVotesActionCreator,
  deleteThreadActionCreator,
  editThreadActionCreator,
  toggleRepostThreadActionCreator,
  asyncAddThread,
  asyncToggleUpvoteThread,
  asyncToggleDownvoteThread,
  asyncToggleRepostThread,
  asyncDeleteThread,
  asyncEditThread
}

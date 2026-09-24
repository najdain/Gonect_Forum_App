const ActionType = {
  TOGGLE_BOOKMARK: 'TOGGLE_BOOKMARK'
}

function toggleBookmarkActionCreator(threadId) {
  return {
    type: ActionType.TOGGLE_BOOKMARK,
    payload: {
      threadId
    }
  }
}

export {
  ActionType,
  toggleBookmarkActionCreator
}

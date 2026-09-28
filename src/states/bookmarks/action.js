const ActionType = {
  TOGGLE_BOOKMARK: 'TOGGLE_BOOKMARK'
}

// Action toggle simpan utas ke bookmark
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

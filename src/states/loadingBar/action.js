const ActionType = {
  SHOW_LOADING: 'loadingBar/SHOW',
  HIDE_LOADING: 'loadingBar/HIDE',
  RESET_LOADING: 'loadingBar/RESET'
}

function showLoading() {
  return {
    type: ActionType.SHOW_LOADING
  }
}

function hideLoading() {
  return {
    type: ActionType.HIDE_LOADING
  }
}

function resetLoading() {
  return {
    type: ActionType.RESET_LOADING
  }
}

export { ActionType, showLoading, hideLoading, resetLoading }

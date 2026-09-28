const ActionType = {
  SHOW_LOADING: 'loadingBar/SHOW',
  HIDE_LOADING: 'loadingBar/HIDE',
  RESET_LOADING: 'loadingBar/RESET'
}

// Action tampilkan loading bar
function showLoading() {
  return {
    type: ActionType.SHOW_LOADING
  }
}

// Action sembunyikan loading bar
function hideLoading() {
  return {
    type: ActionType.HIDE_LOADING
  }
}

// Action reset loading bar
function resetLoading() {
  return {
    type: ActionType.RESET_LOADING
  }
}

export { ActionType, showLoading, hideLoading, resetLoading }

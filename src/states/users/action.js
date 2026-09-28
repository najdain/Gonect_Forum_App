import api from '../../utils/api'
import { showLoading, hideLoading } from '../loadingBar/action'

const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
  UPDATE_USER: 'UPDATE_USER'
}

// Action simpan daftar pengguna
function receiveUsersActionCreator(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users
    }
  }
}

// Action perbarui data pengguna
function updateUserActionCreator(user) {
  return {
    type: ActionType.UPDATE_USER,
    payload: {
      user
    }
  }
}

// Thunk registrasi akun baru
function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      await api.register({ name, email, password })
    } catch (error) {
      alert(error.message)
      throw error
    } finally {
      dispatch(hideLoading())
    }
  }
}

export {
  ActionType,
  receiveUsersActionCreator,
  updateUserActionCreator,
  asyncRegisterUser
}

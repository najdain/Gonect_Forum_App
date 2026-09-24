/**
 * Skenario Pengujian:
 *
 * - asyncSetAuthUser thunk:
 *  - should dispatch action correctly when login success
 *  - should dispatch action and call alert correctly when login failed
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import api from '../../utils/api'
import { asyncSetAuthUser, setAuthUserActionCreator } from './action'
import { showLoading, hideLoading } from '../loadingBar/action'

const fakeToken = 'fake-token-123'
const fakeAuthUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://generated-image-url.jpg'
}
const fakeErrorResponse = new Error('Invalid email or password')

describe('asyncSetAuthUser thunk', () => {
  beforeEach(() => {
    api._login = api.login
    api._putAccessToken = api.putAccessToken
    api._getOwnProfile = api.getOwnProfile
  })

  afterEach(() => {
    api.login = api._login
    api.putAccessToken = api._putAccessToken
    api.getOwnProfile = api._getOwnProfile
    delete api._login
    delete api._putAccessToken
    delete api._getOwnProfile
    vi.restoreAllMocks()
  })

  it('should dispatch action correctly when login success', async () => {
    // arrange
    api.login = () => Promise.resolve(fakeToken)
    api.putAccessToken = vi.fn()
    api.getOwnProfile = () => Promise.resolve(fakeAuthUser)
    const dispatch = vi.fn()

    // action
    await asyncSetAuthUser({ email: 'john@example.com', password: 'secretpassword' })(dispatch)

    // assert
    expect(dispatch).toHaveBeenCalledWith(showLoading())
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken)
    expect(dispatch).toHaveBeenCalledWith(setAuthUserActionCreator(fakeAuthUser))
    expect(dispatch).toHaveBeenCalledWith(hideLoading())
  })

  it('should dispatch action and call alert correctly when login failed', async () => {
    // arrange
    api.login = () => Promise.reject(fakeErrorResponse)
    api.putAccessToken = vi.fn()
    api.getOwnProfile = () => Promise.resolve(fakeAuthUser)
    const dispatch = vi.fn()
    window.alert = vi.fn()

    // action & assert
    await expect(
      asyncSetAuthUser({ email: 'wrong@example.com', password: 'wrong' })(dispatch)
    ).rejects.toThrow(fakeErrorResponse)

    expect(dispatch).toHaveBeenCalledWith(showLoading())
    expect(window.alert).toHaveBeenCalledWith(fakeErrorResponse.message)
    expect(dispatch).toHaveBeenCalledWith(hideLoading())
  })
})

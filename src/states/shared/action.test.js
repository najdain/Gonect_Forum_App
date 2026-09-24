/**
 * Skenario Pengujian:
 *
 * - asyncPopulateUsersAndThreads thunk:
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action and call alert correctly when data fetching failed
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import api from '../../utils/api'
import { asyncPopulateUsersAndThreads } from './action'
import { receiveUsersActionCreator } from '../users/action'
import { receiveThreadsActionCreator } from '../threads/action'
import { receiveLeaderboardsActionCreator } from '../leaderboards/action'
import { showLoading, hideLoading } from '../loadingBar/action'

const fakeUsersResponse = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://generated-image-url.jpg'
  }
]

const fakeThreadsResponse = [
  {
    id: 'thread-1',
    title: 'Thread Pertama',
    body: 'Ini adalah thread pertama',
    category: 'General',
    createdAt: '2023-05-29T07:55:52.266Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0
  }
]

const fakeLeaderboardsResponse = [
  {
    user: fakeUsersResponse[0],
    score: 100
  }
]

const fakeErrorResponse = new Error('Ups, something went wrong')

describe('asyncPopulateUsersAndThreads thunk', () => {
  beforeEach(() => {
    api._getAllUsers = api.getAllUsers
    api._getAllThreads = api.getAllThreads
    api._getLeaderboards = api.getLeaderboards
  })

  afterEach(() => {
    api.getAllUsers = api._getAllUsers
    api.getAllThreads = api._getAllThreads
    api.getLeaderboards = api._getLeaderboards
    delete api._getAllUsers
    delete api._getAllThreads
    delete api._getLeaderboards
    vi.restoreAllMocks()
  })

  it('should dispatch action correctly when data fetching success', async () => {
    // arrange
    api.getAllUsers = () => Promise.resolve(fakeUsersResponse)
    api.getAllThreads = () => Promise.resolve(fakeThreadsResponse)
    api.getLeaderboards = () => Promise.resolve(fakeLeaderboardsResponse)
    const dispatch = vi.fn()

    // action
    await asyncPopulateUsersAndThreads()(dispatch)

    // assert
    expect(dispatch).toHaveBeenCalledWith(showLoading())
    expect(dispatch).toHaveBeenCalledWith(receiveUsersActionCreator(fakeUsersResponse))
    expect(dispatch).toHaveBeenCalledWith(receiveThreadsActionCreator(fakeThreadsResponse))
    expect(dispatch).toHaveBeenCalledWith(receiveLeaderboardsActionCreator(fakeLeaderboardsResponse))
    expect(dispatch).toHaveBeenCalledWith(hideLoading())
  })

  it('should dispatch action and call alert correctly when data fetching failed', async () => {
    // arrange
    api.getAllUsers = () => Promise.reject(fakeErrorResponse)
    api.getAllThreads = () => Promise.reject(fakeErrorResponse)
    api.getLeaderboards = () => Promise.reject(fakeErrorResponse)
    const dispatch = vi.fn()
    window.alert = vi.fn()

    // action
    await asyncPopulateUsersAndThreads()(dispatch)

    // assert
    expect(dispatch).toHaveBeenCalledWith(showLoading())
    expect(window.alert).toHaveBeenCalledWith(fakeErrorResponse.message)
    expect(dispatch).toHaveBeenCalledWith(hideLoading())
  })
})

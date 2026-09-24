/**
 * Skenario Pengujian:
 *
 * - threadsReducer function:
 *  - should return the initial state when given by unknown action
 *  - should return the threads when given by RECEIVE_THREADS action
 *  - should return the threads with the new thread when given by ADD_THREAD action
 *  - should return the threads with updated votes when given by UPDATE_THREAD_VOTES action
 */

import { describe, it, expect } from 'vitest'
import threadsReducer from './reducer'
import { ActionType } from './action'

describe('threadsReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = []
    const action = { type: 'UNKNOWN' }

    // action
    const actualState = threadsReducer(initialState, action)

    // assert
    expect(actualState).toEqual(initialState)
  })

  it('should return the threads when given by RECEIVE_THREADS action', () => {
    // arrange
    const initialState = []
    const action = {
      type: ActionType.RECEIVE_THREADS,
      payload: {
        threads: [
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
          },
          {
            id: 'thread-2',
            title: 'Thread Kedua',
            body: 'Ini adalah thread kedua',
            category: 'React',
            createdAt: '2023-05-29T07:55:52.266Z',
            ownerId: 'user-2',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0
          }
        ]
      }
    }

    // action
    const actualState = threadsReducer(initialState, action)

    // assert
    expect(actualState).toEqual(action.payload.threads)
  })

  it('should return the threads with the new thread when given by ADD_THREAD action', () => {
    // arrange
    const initialState = [
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
    const newThread = {
      id: 'thread-2',
      title: 'Thread Baru',
      body: 'Ini adalah thread baru yang ditambahkan',
      category: 'Redux',
      createdAt: '2023-05-29T08:00:00.000Z',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0
    }
    const action = {
      type: ActionType.ADD_THREAD,
      payload: {
        thread: newThread
      }
    }

    // action
    const actualState = threadsReducer(initialState, action)

    // assert
    expect(actualState).toEqual([newThread, ...initialState])
  })

  it('should return the threads with updated votes when given by UPDATE_THREAD_VOTES action', () => {
    // arrange
    const initialState = [
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
    const action = {
      type: ActionType.UPDATE_THREAD_VOTES,
      payload: {
        threadId: 'thread-1',
        upVotesBy: ['user-1'],
        downVotesBy: []
      }
    }

    // action
    const actualState = threadsReducer(initialState, action)

    // assert
    expect(actualState).toEqual([
      {
        ...initialState[0],
        upVotesBy: ['user-1'],
        downVotesBy: []
      }
    ])
  })
})

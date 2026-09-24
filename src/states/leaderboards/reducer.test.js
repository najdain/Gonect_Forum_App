/**
 * Skenario Pengujian:
 *
 * - leaderboardsReducer function:
 *  - should return the initial state when given by unknown action
 *  - should return the leaderboards when given by RECEIVE_LEADERBOARDS action
 */

import { describe, it, expect } from 'vitest'
import leaderboardsReducer from './reducer'
import { ActionType } from './action'

describe('leaderboardsReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = []
    const action = { type: 'UNKNOWN' }

    // action
    const actualState = leaderboardsReducer(initialState, action)

    // assert
    expect(actualState).toEqual(initialState)
  })

  it('should return the leaderboards when given by RECEIVE_LEADERBOARDS action', () => {
    // arrange
    const initialState = []
    const action = {
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: {
        leaderboards: [
          {
            user: {
              id: 'users-1',
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://generated-image-url.jpg'
            },
            score: 100
          }
        ]
      }
    }

    // action
    const actualState = leaderboardsReducer(initialState, action)

    // assert
    expect(actualState).toEqual(action.payload.leaderboards)
  })
})

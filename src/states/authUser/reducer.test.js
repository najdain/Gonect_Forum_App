/**
 * Skenario Pengujian:
 *
 * - authUserReducer function:
 *  - should return the initial state when given by unknown action
 *  - should return the authUser when given by SET_AUTH_USER action
 *  - should return null when given by UNSET_AUTH_USER action
 *  - should return the authUser with the updated data when given by UPDATE_AUTH_USER action
 */

import { describe, it, expect, beforeEach } from 'vitest'
import authUserReducer from './reducer'
import { ActionType } from './action'

describe('authUserReducer function', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = null
    const action = { type: 'UNKNOWN' }

    // action
    const actualState = authUserReducer(initialState, action)

    // assert
    expect(actualState).toEqual(initialState)
  })

  it('should return the authUser when given by SET_AUTH_USER action', () => {
    // arrange
    const initialState = null
    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: {
        authUser: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://generated-image-url.jpg'
        }
      }
    }

    // action
    const actualState = authUserReducer(initialState, action)

    // assert
    expect(actualState).toEqual(action.payload.authUser)
  })

  it('should return null when given by UNSET_AUTH_USER action', () => {
    // arrange
    const initialState = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://generated-image-url.jpg'
    }
    const action = {
      type: ActionType.UNSET_AUTH_USER
    }

    // action
    const actualState = authUserReducer(initialState, action)

    // assert
    expect(actualState).toBeNull()
  })

  it('should return the authUser with the updated data when given by UPDATE_AUTH_USER action', () => {
    // arrange
    const initialState = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Developer'
    }
    const action = {
      type: ActionType.UPDATE_AUTH_USER,
      payload: {
        updatedData: {
          bio: 'Senior Developer',
          location: 'Jakarta'
        }
      }
    }

    // action
    const actualState = authUserReducer(initialState, action)

    // assert
    expect(actualState).toEqual({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Senior Developer',
      location: 'Jakarta'
    })
  })
})

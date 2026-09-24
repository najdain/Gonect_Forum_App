import { ActionType } from './action'

function leaderboardsReducer(state = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_LEADERBOARDS:
      return action.payload.leaderboards || []

    case ActionType.INCREMENT_USER_SCORE: {
      const { user, points } = action.payload
      if (!user || !user.id) return state

      const userExists = state.some((item) => item.user?.id === user.id)

      let updatedList = []
      if (userExists) {
        updatedList = state.map((item) => {
          if (item.user?.id === user.id) {
            return { ...item, score: Math.max(0, item.score + points) }
          }
          return item
        })
      } else {
        updatedList = [...state, { user, score: Math.max(0, points) }]
      }

      return [...updatedList].sort((a, b) => b.score - a.score)
    }

    default:
      return state
  }
}

export default leaderboardsReducer

import Immutable from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
const REHYDRATED = 'persist/REHYDRATED'

// ------------------------------------
// Actions
// ------------------------------------
export function updateRehydrated (rehydrated) {
  return {
    type    : REHYDRATED,
    payload : rehydrated
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REHYDRATED]: (state, { payload }) => {
    return state.set('rehydrated', payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Immutable.fromJS({
  rehydrated: false
})

export default function persistReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

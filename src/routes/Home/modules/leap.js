import { createAction } from 'redux-actions'
import { fromJS, List } from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const TOGGLE = 'leap/TOGGLE'
export const UPDATE_RESULT = 'leap/UPDATE_RESULT'
export const CLEAR = 'leap/CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const toggleLeap = createAction(TOGGLE)
export const updateResult = createAction(UPDATE_RESULT)
export const clearLeap = createAction(CLEAR)

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TOGGLE]: (state, { payload }) => {
    return state.update('isRecording', isRecording => !isRecording)
  },
  [UPDATE_RESULT]: (state, { payload }) => {
    return state.set('result', payload ? fromJS(payload) : List())
  },
  [CLEAR]: (state, { payload }) => {
    return initialState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isRecording: false,
  result: []
})

export default function interfaceReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

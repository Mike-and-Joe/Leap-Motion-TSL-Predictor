import { createAction } from 'redux-actions'
import { fromJS, List } from 'immutable'

// ------------------------------------
// Constants
// ------------------------------------
export const TOGGLE = 'leap/TOGGLE'
export const UPDATE_RESULT = 'leap/UPDATE_RESULT'
export const ADD_FRAME = 'leap/ADD_FRAME'
export const CLEAR_FRAMES = 'leap/CLEAR_FRAMES'

// ------------------------------------
// Actions
// ------------------------------------
export const toggleLeap = createAction(TOGGLE)
export const updateResult = createAction(UPDATE_RESULT)
export const addFrame = createAction(ADD_FRAME)
export const clearFrames = createAction(CLEAR_FRAMES)

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
  [ADD_FRAME]: (state, { payload }) => {
    return state.update('frames', frames => frames.push(payload))
  },
  [CLEAR_FRAMES]: (state, { payload }) => {
    return state.set('frames', initialState.get('frames'))
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isRecording: false,
  frames: [],
  result: []
})

export default function interfaceReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

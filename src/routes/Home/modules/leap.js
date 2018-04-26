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
export const updateResult = createAction(UPDATE_RESULT)
export const addFrame = createAction(ADD_FRAME)
export const clearFrames = createAction(CLEAR_FRAMES)

export const toggleLeap = () => {
  return (dispatch, getState) => {
    if (getState().get('leap').get('isRecording')) {
      dispatch(sendPredict())
    }
    dispatch(createAction(TOGGLE)())
  }
}

export const sendPredict = () => {
  return (dispatch, getState) => {
    const frames = getState().get('leap').get('frames')
    dispatch(clearFrames())
    const BASE_URL = __PROD__ ? 'http://35.196.139.78:5000' : 'http://localhost:5000'

    fetch(BASE_URL + '/predict', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'leap_data': [
          frames.toJS()
        ]
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log('result: ', response)
      dispatch(updateResult(response))
    })
    .catch((err) => console.error('prediction error: ', err))
  }
}

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

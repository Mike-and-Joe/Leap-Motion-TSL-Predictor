import { combineReducers } from 'redux-immutable'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: require('./location').default,
    leap: require('../routes/Home/modules/leap').default,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

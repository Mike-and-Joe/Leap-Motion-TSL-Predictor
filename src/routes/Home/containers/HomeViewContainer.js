import { connect } from 'react-redux'

import HomeView from '../components/HomeView'

import { toggleLeap, updateResult, addFrame, clearFrames } from '../modules/leap'

const mapStateToProps = (state, ownProps) => ({
  isRecording: state.get('leap').get('isRecording'),
  result: state.get('leap').get('result'),
  frames: state.get('leap').get('frames')
})

const mapDispatchToProps = {
  toggleLeap,
  updateResult,
  addFrame,
  clearFrames
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)

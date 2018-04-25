import { connect } from 'react-redux'

import HomeView from '../components/HomeView'

import { toggleLeap, addFrame } from '../modules/leap'

const mapStateToProps = (state, ownProps) => ({
  isRecording: state.get('leap').get('isRecording'),
  result: state.get('leap').get('result')
})

const mapDispatchToProps = {
  toggleLeap,
  addFrame
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)

import React from 'react'
import Leap from 'leapjs'
import PropTypes from 'prop-types'
import { map, capitalize } from 'lodash'
// import Immutable from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'

import DuckImage from '../assets/Duck.jpg'

import './HomeView.scss'

export class HomeView extends React.Component {
  state = {
    frame: {}
  }

  componentWillMount () {
    this.setupLeapMotion()
    document.addEventListener('keydown', this.recordWithSpace)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.recordWithSpace)
  }

  recordWithSpace = (e) => {
    e.keyCode === 32 && this.props.toggleLeap()
  }

  setupLeapMotion () {
    Leap.loop({
      hand: (hand) => {
        // console.log(hand)
      },
      frame: (frame) => {
        if (this.props.isRecording) {
          const convertedFrame = this.convertFrame(frame)
          this.props.addFrame(convertedFrame)
          this.setState({ frame: convertedFrame })
        }
      }
    })
  }

  convertFrame (frame) {
    const nameMap = ['thumb', 'index', 'middle', 'ring', 'pinky']

    const outFrame = { id: frame.id, hands: {} }
    frame.hands.map((hand, index) => {
      const handObject = {
        arm: { direction: hand.arm && hand.arm.basis },
        hand_palm_position: hand.palmPosition,
        roll: hand.roll() / Math.PI * 180,
        pitch: hand.pitch() / Math.PI * 180,
        yaw: hand.yaw() / Math.PI * 180,
        fingers: {}
      }

      hand.fingers.map((finger, index) => {
        handObject['fingers'][nameMap[finger.type]] = {
          bones: {
            distal: {
              next_joint: finger.distal.nextJoint
            },
            proximal: {
              direction: finger.distal.nextJoint
            }
          }
        }
      })

      outFrame['hands'][hand.type] = handObject
    })

    return outFrame
  }

  render () {
    const { frame } = this.state
    return (
      <div>
        <h4>Welcome!</h4>
        <img alt='This is a duck, because Redux!' className='duck' src={DuckImage} />
        <h5>Record status : {this.props.isRecording.toString()}</h5>
        <h4>Result : {JSON.stringify(this.props.result.toJS())}</h4>
        <p>frame id: {frame.id}</p>
        <p>hands: {frame.hands && Object.keys(frame.hands).length }</p>
        <p>hands: [ {frame.hands && map(frame.hands, (hand, key) => capitalize(key)).join(', ')} ]</p>
        <p>frame: {JSON.stringify(frame) }</p>
      </div>
    )
  }
}

HomeView.propTypes = {
  isRecording: PropTypes.bool,
  result: ImmutablePropTypes.list,
  addFrame: PropTypes.func,
  toggleLeap: PropTypes.func
}

export default HomeView

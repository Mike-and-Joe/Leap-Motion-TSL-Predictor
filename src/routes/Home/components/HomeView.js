import React from 'react'
// import Leap from 'leapjs'
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

  componentDidMount () {
    this.setupLeapMotion()
    document.addEventListener('keydown', this.recordWithSpace)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.recordWithSpace)
    window.controller.disconnect()
    window.controller.stopUsing()
  }

  recordWithSpace = (e) => {
    e.keyCode === 32 && this.props.toggleLeap()
  }

  setupLeapMotion () {
    const THREE = window.THREE
    // Set the scene size.
    const WIDTH = 800
    const HEIGHT = 500

    // Set some camera attributes.
    const VIEW_ANGLE = 45
    const ASPECT = WIDTH / HEIGHT
    const NEAR = 0.1
    const FAR = 10000

    // Get the DOM element to attach to
    const container = document.querySelector('#container')

    // Create a WebGL renderer, camera
    // and a scene
    const renderer = new THREE.WebGLRenderer({
      alpha: true
    })
    const camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        )

    const scene = new THREE.Scene()
    const axis = new THREE.AxisHelper(40)
    scene.add(axis)
    scene.add(new THREE.AmbientLight(0x888888))
    const pointLight = new THREE.PointLight(0xFFffff)
    pointLight.position.set(-20, 10, 0)
    pointLight.lookAt(new THREE.Vector3(0, 0, 0))
    scene.add(pointLight)
    window.camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000)
    camera.position.fromArray([0, 1000, 0])
    camera.up = new THREE.Vector3(0, 1, -1)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Add the camera to the scene.
    scene.add(camera)

    // Start the renderer.
    renderer.setClearColor(0x000000, 1)
    renderer.setSize(WIDTH, HEIGHT)

    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(renderer.domElement)
    renderer.render(scene, camera)

    window.controller = new window.Leap.Controller()
    window.controller.loop({
      frame: (frame) => {
        if (this.props.isRecording) {
          const convertedFrame = this.convertFrame(frame)
          this.props.addFrame(convertedFrame)
          this.setState({ frame: convertedFrame })
        }
      }
    })
    .use('handHold', {})
    .use('handEntry', {})
    .use('riggedHand', {
      parent: scene,
      renderer: renderer,
      camera: camera,
      helper: true,
      offset: new THREE.Vector3(0, 0, 0),
      renderFn: function () {
        renderer.render(scene, camera)
      },
      checkWebGL: true
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
        <p>hands: {frame.hands && Object.keys(frame.hands).length } .... [ {frame.hands && map(frame.hands, (hand, key) => capitalize(key)).join(', ')} ]</p>
        {/* <p>frame: {JSON.stringify(frame) }</p> */}
        <div id='container'>{}</div>
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

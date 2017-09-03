import React, { Component } from 'react';
import { connect } from 'react-redux';

import { s_loadImage, s_setTime, s_runSimulator, s_pauseSimulator, s_stopSimulator } from 'actions/simulatorActions';
import { r_tick } from 'actions/robotActions';
import { getRobot, getWorld } from 'selectors';
import { getHistory, getSimulatorTime } from 'selectors/simulatorSelectors';

import { MAX_ROBOT_RUNTIME } from 'constants/simulator';

import Canvas from './Canvas';
import SimulatorControls from './SimulatorControls';
import Track from 'assets/track.png';
import './Simulator.css';

class Simulator extends Component {

  constructor() {
    super();
    this.onSeek = this.onSeek.bind(this);
  }

  componentWillMount() {
    this.loadImage();
  }

  loadImage() {
    const getResizedImage = (src, realWorldWidth, realWorldHeight) => {
      const img = new Image();
      img.onload = () => {
        this.props.loadImage({img, realWorldWidth, realWorldHeight});
      };

      img.src = src;
    };

    // FIXME: Add params dynamically
    getResizedImage(Track, 0.841, 1.189);
  }

  onSeek(time) {
    this.props.setTime(time);
  }


  getVideo() {
    // FIXME: Implement
  }

  preAnimate() {

  }

  animate() {

  }

  loop() {

  }

  render() {
    const {world} = this.props;

    let canvas;
    if (world.get('pixels').length > 0) {
      canvas = <Canvas
        robot={this.props.robot}
        scale={0.5}
        field={world.get('pixels')}
        width={world.get('width')}
        height={world.get('height')}
      />
    } else {
      canvas = <h1>Loading...</h1>
    }

    // FIXME: Change to prerendered canvases as video?
    return (
      <div className="Simulator">
        <SimulatorControls
          history={this.props.history}
          onPlay={this.props.runSimulator}
          onNext={''}
          onPrevious={''}
          onPause={this.props.pauseSimulator}
          onStop={this.props.stopSimulator}
          onChange={this.onSeek}
          step={this.props.robot.get('sensorInterval')}
          time={this.props.time}
        />
        {canvas}
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  robot: getRobot(appState),
  world: getWorld(appState),
  history: getHistory(appState),
  time: getSimulatorTime(appState)
});

const mapDispatchToProps = {
  runSimulator: s_runSimulator,
  stopSimulator: s_stopSimulator,
  pauseSimulator: s_pauseSimulator,
  loadImage: s_loadImage,
  tick: r_tick,
  setTime: s_setTime
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
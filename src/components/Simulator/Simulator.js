import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  s_loadImage,
  s_seekTime,
  s_runSimulator,
  s_pauseSimulator,
  s_stepNext,
  s_stepPrevious,
  s_stopSimulator
} from 'actions/simulatorActions';
import { r_tick } from 'actions/robotActions';
import { getRobot, getWorld } from 'selectors';
import { getHistory, getSimulatorTime, getLoading } from 'selectors/simulatorSelectors';

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
    this.props.seekTime(time);
  }

  getCanvas() {
    const world = this.props.world;

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
      canvas = this.getLoadingOverlay();
    }

    return canvas;
  }

  getLoadingOverlay() {
    return (
      <div className="loading">
        <div className="overlay"/>
        <div className="spinnerContainer">
          <div className="spinner"/>
        </div>
      </div>
    );
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
    // FIXME: Change to prerendered canvases as video?
    return (
      <div className="Simulator">
        <SimulatorControls
          history={this.props.history}
          onPlay={this.props.runSimulator}
          onNext={this.props.stepNext}
          onPrevious={this.props.stepPrevious}
          onPause={this.props.pauseSimulator}
          onStop={this.props.stopSimulator}
          onChange={this.onSeek}
          step={this.props.robot.get('sensorInterval')}
          time={this.props.time}
        />
        {this.getCanvas()}
        {this.props.loading && this.getLoadingOverlay()}
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  robot: getRobot(appState),
  world: getWorld(appState),
  history: getHistory(appState),
  time: getSimulatorTime(appState),
  loading: getLoading(appState)
});

const mapDispatchToProps = {
  runSimulator: s_runSimulator,
  stopSimulator: s_stopSimulator,
  pauseSimulator: s_pauseSimulator,
  stepNext: s_stepNext,
  stepPrevious: s_stepPrevious,
  loadImage: s_loadImage,
  tick: r_tick,
  seekTime: s_seekTime
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
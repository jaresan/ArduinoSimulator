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
import SimulatorToolbar from './SimulatorToolbar';
import Track from 'assets/track.png';
import './Simulator.css';

class Simulator extends Component {
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
        <SimulatorToolbar
          robot={this.props.robot}
          time={this.props.time}
          maxTime={this.props.history.keySeq().last()}
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
  loadImage: s_loadImage,
  tick: r_tick
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
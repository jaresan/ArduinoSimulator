import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  s_loadImage
} from 'actions/simulatorActions';
import { r_tick } from 'actions/robotActions';
import { getRobot, getWorld } from 'selectors';
import { getHistory, getSimulatorTime, getLoading } from 'selectors/simulatorSelectors';

import Canvas from './Canvas';
import SimulatorToolbar from './SimulatorToolbar';
import './Simulator.css';
import { r_clearHistory } from '../../actions/simulatorActions';
import { r_resetRobot } from '../../actions/robotActions';

class Simulator extends Component {
  loadImage([src, realWorldWidth, realWorldHeight]) {
    const img = new Image();
    img.onload = () => {
      this.props.loadImage({img, realWorldWidth, realWorldHeight});
    };

    img.src = src;
    this.props.clearSimulator();
    this.props.resetRobot();
  }

  componentDidMount() {
    this.loadImage(this.props.track);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.track !== this.props.track) {
      this.loadImage(this.props.track);
    }
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
  resetRobot: r_resetRobot,
  clearSimulator: r_clearHistory,
  tick: r_tick
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);

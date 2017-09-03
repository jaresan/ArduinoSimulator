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
import { getRobot } from 'selectors';
import {getSimulatorTime, getLoading } from 'selectors/simulatorSelectors';

import SimulatorControls from './SimulatorControls';
import './Simulator.css';

class SimulatorToolbar extends Component {
  render() {
    return (
      <div>
        {/*{this.renderSensors()}*/}
        <SimulatorControls
          maxTime={this.props.maxTime}
          onPlay={this.props.runSimulator}
          onNext={this.props.stepNext}
          onPrevious={this.props.stepPrevious}
          onPause={this.props.pauseSimulator}
          onStop={this.props.stopSimulator}
          onChange={this.props.seekTime}
          step={this.props.robot.get('sensorInterval')}
          time={this.props.time}
        />
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  loading: getLoading(appState)
});

const mapDispatchToProps = {
  runSimulator: s_runSimulator,
  stopSimulator: s_stopSimulator,
  pauseSimulator: s_pauseSimulator,
  stepNext: s_stepNext,
  stepPrevious: s_stepPrevious,
  seekTime: s_seekTime
};

export default connect(mapStateToProps, mapDispatchToProps)(SimulatorToolbar);

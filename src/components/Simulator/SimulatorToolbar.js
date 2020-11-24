import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  s_seekTime,
  s_runSimulator,
  s_pauseSimulator,
  s_stepNext,
  s_stepPrevious,
  s_stopSimulator
} from 'actions/simulatorActions';
import {r_setPosition} from 'actions/robotActions';

import {getWorld} from 'selectors';
import { getLoading } from 'selectors/simulatorSelectors';

import SimulatorControls from './SimulatorControls';
import './SimulatorToolbar.css';

class SimulatorToolbar extends Component {

  renderSensors() {
    let sensors = this.props.robot.get('sensorReadings').toJS();
    if (sensors.length === 0) {
      sensors = [false, false, false, false, false];
    }

    return (
      <div className="sensorReadings">
        {sensors.map(sensor => <div className={`reading ${sensor ? 'active' : ''}`}/>)}
      </div>
    );
  }

  renderPositionInfo() {
    const {robot, setPosition, world} = this.props;

    const unwrap = e => e.target.value;
    const {position: {x, y}, rotation} = robot.toJS();
    const payload = {x, y, r: rotation};
    const onChange = key => e => setPosition({...payload, [key]: parseFloat(unwrap(e)), pixels: world.get('pixels')});
    return (
      <table className="positionInfo">
        <tbody>
          <tr className="positionInfoRow">
            <td>x:</td>
            <td><input className="positionInput" type="number" value={x} onChange={onChange('x')}/></td>
          </tr>
          <tr className="positionInfoRow">
            <td>y:</td>
            <td><input className="positionInput" type="number" value={y} onChange={onChange('y')}/></td>
          </tr>
          <tr className="positionInfoRow">
            <td>r:</td>
            <td><input className="positionInput" type="number" value={rotation} onChange={onChange('r')}/></td>
          </tr>
        </tbody>
      </table>
    );
  }


  render() {
    return (
      <div className="SimulatorToolbar">
        {this.renderSensors()}
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
        {this.renderPositionInfo()}
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  loading: getLoading(appState),
  world: getWorld(appState)
});

const mapDispatchToProps = {
  runSimulator: s_runSimulator,
  stopSimulator: s_stopSimulator,
  pauseSimulator: s_pauseSimulator,
  stepNext: s_stepNext,
  stepPrevious: s_stepPrevious,
  seekTime: s_seekTime,
  setPosition: r_setPosition
};

export default connect(mapStateToProps, mapDispatchToProps)(SimulatorToolbar);

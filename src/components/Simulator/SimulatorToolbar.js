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
    const robot = this.props.robot;

    const getTableRow = (name, query, editable) => {
      return (
        <tr className="positionInfoRow">
          <td>{`${name}:`}</td>
          <td><input className="positionInput" readOnly={!editable} type="number" value={robot.getIn(query)}/></td>
        </tr>
      );
    };

    return (
      <table className="positionInfo">
        <tbody>
          {
            [['x', ['position', 'x']], ['y', ['position', 'y']], ['r', ['rotation'], true]]
              .map(params => getTableRow(...params))
          }
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

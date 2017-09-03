import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './SimulatorControls.css';


// FIXME: Reset time on simulator reset
// FIXME: Change play button to pause when running
class SimulatorControls extends Component {
  constructor() {
    super();
    this.state = {
      time: 0
    };
  }

  onChangeTime(time) {
    this.setState({
      time: time
    });
    this.props.onChange(time);
  }


  render() {
    return (
      <div className="SimulatorControls">
        <Slider
          disabled={!this.props.history.keySeq().last()}
          min={0}
          max={this.props.history.keySeq().last()}
          step={this.props.step}
          onChange={time => this.onChangeTime(time)}
          value={this.props.time}
        />
        <div className="controlButtons">
          <i onClick={this.props.onStop} className="icon-stop" aria-hidden="true"/>
          <i onClick={this.props.onPrevious} className="icon-previous" aria-hidden="true"/>
          <i onClick={this.props.onPlay} className="icon-play" aria-hidden="true"/>
          <i onClick={this.props.onNext} className="icon-next" aria-hidden="true"/>
          <i onClick={this.props.onPause} className="icon-pause" aria-hidden="true"/>
        </div>
      </div>
    )
  }
}

SimulatorControls.propTypes = {
  history: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  time: PropTypes.number.isRequired
};

export default SimulatorControls;

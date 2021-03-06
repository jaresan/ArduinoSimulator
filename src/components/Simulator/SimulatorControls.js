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

  componentWillReceiveProps(props) {
    if (props.time !== this.state.time) {
      this.setState({
        time: props.time
      });
    }
  }

  onChangeTime(time) {
    this.setState({
      time: time
    });
    this.props.onChange(time);
  }

  getDisabledButtons() {
    const codeLoaded = this.props.maxTime;

    return {
      previous: !codeLoaded || this.state.time === 0,
      next: !codeLoaded || this.state.time === this.props.maxTime,
      stop: !codeLoaded,
      play: !codeLoaded,
      pause: !codeLoaded
    };
  }

  render() {
    const disabled = this.getDisabledButtons();

    return (
      <div className="SimulatorControls">
        <Slider
          disabled={!this.props.maxTime}
          min={0}
          max={this.props.maxTime}
          step={this.props.step}
          onChange={time => this.onChangeTime(time)}
          value={this.props.time}
        />
        <div className="controlButtons">
          <i onClick={this.props.onStop} disabled={disabled.stop} className="icon-stop" aria-hidden="true"/>
          <i onClick={this.props.onPrevious} disabled={disabled.previous} className="icon-previous" aria-hidden="true"/>
          <i onClick={this.props.onPlay} disabled={disabled.play} className="icon-play" aria-hidden="true"/>
          <i onClick={this.props.onNext} disabled={disabled.next} className="icon-next" aria-hidden="true"/>
          <i onClick={this.props.onPause} disabled={disabled.pause} className="icon-pause" aria-hidden="true"/>
        </div>
      </div>
    )
  }
}

SimulatorControls.propTypes = {
  maxTime: PropTypes.number,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  time: PropTypes.number
};

export default SimulatorControls;

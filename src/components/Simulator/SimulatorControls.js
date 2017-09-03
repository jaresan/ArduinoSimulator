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

    this.handleControlsClick = this.handleControlsClick.bind(this);
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
    const codeLoaded = this.props.history.keySeq().last();

    return {
      previous: !codeLoaded || this.state.time === 0,
      next: !codeLoaded || this.state.time === this.props.history.keySeq().last(),
      stop: !codeLoaded,
      play: !codeLoaded,
      pause: !codeLoaded
    };
  }

  handleControlsClick() {
    if (!this.props.history.keySeq().last()) {
      alert('Please execute the code first.');
    }
  }


  render() {
    const disabled = this.getDisabledButtons();

    return (
      <div onClick={this.handleControlsClick} className="SimulatorControls">
        <Slider
          disabled={!this.props.history.keySeq().last()}
          min={0}
          max={this.props.history.keySeq().last()}
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

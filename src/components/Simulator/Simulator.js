import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PlaybackControls } from 'react-player-controls'
import Canvas from './Canvas';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { MAX_ROBOT_RUNTIME } from 'constants/simulator';
import { s_loadImage, s_seekTime, s_runSimulator } from 'actions/simulatorActions';
import { r_tick } from 'actions/robotActions';
import { getRobot, getWorld } from 'selectors';
import { getHistory, getSimulatorTime } from 'selectors/simulatorSelectors';

import Track from 'assets/track.png';
import './Simulator.css';

class Simulator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0
    };
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
        <PlaybackControls
          isPlayable={true}
          isPlaying={false}
          onPlaybackChange={this.props.runSimulator}
          showPrevious={true}
          hasPrevious={true}
          onPrevious={() => console.log('PREFIUS')}
          showNext={true}
          hasNext={true}
          onNext={() => console.log('ajajajajaja')}
        />
        {canvas}
        <Slider
          disabled={!this.props.history.keySeq().last()}
          min={0}
          max={this.props.history.keySeq().last()}
          step={this.props.robot.get('sensorInterval')}
          onChange={time => this.onSeek(time)}
          value={this.props.time}
        />
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
  loadImage: s_loadImage,
  tick: r_tick,
  seekTime: s_seekTime
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
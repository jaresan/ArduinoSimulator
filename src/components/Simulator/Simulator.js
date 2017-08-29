import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PlaybackControls, ProgressBar } from 'react-player-controls'
import Canvas from './Canvas';

import { s_loadImage, s_moveToTime, s_seekTime } from 'actions/simulatorActions';
import { r_tick } from 'actions/robotActions';
import { getRobot, getWorld } from 'selectors';

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
    this.setState({
      currentTime: time
    });

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
        {/*<Robot data={this.props.robot}/>*/}
        {canvas}
        <PlaybackControls
          isPlayable={true}
          isPlaying={false}
          onPlaybackChange={() => console.log('ajajaj')}
          showPrevious={true}
          hasPrevious={true}
          onPrevious={() => console.log('PREFIUS')}
          showNext={true}
          hasNext={true}
          onNext={() => console.log('ajajajajaja')}
        />
        <ProgressBar
          totalTime={60}
          currentTime={this.state.currentTime}
          isSeekable={true}
          onSeek={time => this.onSeek(time)}
        />
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  robot: getRobot(appState),
  world: getWorld(appState)
});

const mapDispatchToProps = {
  loadImage: s_loadImage,
  tick: r_tick,
  seekTime: s_seekTime
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
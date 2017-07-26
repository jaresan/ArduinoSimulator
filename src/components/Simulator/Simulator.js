import React, { Component } from 'react';
import Canvas from './Canvas';
import Robot from './Robot';
import { connect } from 'react-redux';
import { s_loadImage } from 'actions/simulatorActions';
import { r_tick } from 'actions/robotActions';

import { getRobot, getWorld } from 'selectors';

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
    let toRender;

    const {world} = this.props;

    if (world.get('pixels').length > 0) {
      toRender = <Canvas
        robot={this.props.robot}
        field={world.get('pixels')}
        width={world.get('width')}
        height={world.get('height')}
      />
    } else {
      toRender = <h1>Loading...</h1>
    }

    // FIXME: Change to prerendered canvases as video?
    return (
      <div className="Simulator">
        {/*<Robot data={this.props.robot}/>*/}
        {toRender}
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
  tick: r_tick
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
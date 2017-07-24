import React, { Component } from 'react';
import Canvas from './Canvas';
import { connect } from 'react-redux';
import { s_loadImage } from 'actions/simulatorActions';
import Track from 'assets/track.png';

import { getRobot, getWorld } from 'selectors';

import './Simulator.css';

class Simulator extends Component {

  componentWillMount() {
    this.loadImage();
  }

  loadImage() {
    const targetWidth = this.props.width;

    const getResizedImage = (src, targetWidth, realWorldWidth, realWorldHeight) => {
      const img = new Image();
      img.onload = () => {
        this.props.loadImage({img, targetWidth, realWorldWidth, realWorldHeight});
      };

      img.src = src;
    };

    // FIXME: Add params dynamically
    getResizedImage(Track, targetWidth, 1.089, 1.417);
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

    if (world.get('pixels')) {
      toRender = <Canvas
        robot={this.props.robot}
        world={this}
        field={world.get('pixels')}
        width={world.get('width')}
        height={world.get('height')}
      />
    } else {
      toRender = <h1>Loading...</h1>
    }

    return (
      <div className="Simulator">
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
  loadImage: s_loadImage
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
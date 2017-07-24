import React, { Component } from 'react';
import Canvas from './Canvas';
import { connect } from 'react-redux';
import { s_loadImage } from 'actions/simulatorActions';
import Track from 'assets/track.png';

import * as SimulatorSelectors from 'selectors/simulatorSelectors';
import * as Settings from 'constants/WorldSettings';

import './Simulator.less';

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

  /**
   * Converts real world coordinates (specified in meters) to pixel world representation.
   *
   * @param x X coord in real world in metres.
   * @param y Y coord in real world in metres.
   * @param radius rotation in degrees
   */
  convertWorldCoordsToFieldCoords(x, y, radius) {
    x = x * Settings.PIXELS_PER_M;
    y = y * Settings.PIXELS_PER_M;
    radius = radius * Settings.PIXELS_PER_M;

    return {x, y, radius};
  }

  /**
   * Returns true if the line can be seen from specified position in the given radius.
   *
   * @param x X coordinate in real world in metres.
   * @param y Y coordinate in real world in metres.
   * @param radius Radius in which to search in metres.
   * @returns {boolean}
   */
  canSeeLine(x, y, radius) {
    let {x: newX, y: newY, radius: newRadius} = this.convertWorldCoordsToFieldCoords(x, y, radius);
    newX = Math.round(newX);
    newY = Math.round(newY);

    let lineSeen = false;
    for (let i = 0; i <= newRadius; i++) {
      for (let j = 0; j <= newRadius; j++) {
        if (newX + j < this.field.length && newY + i < this.field[0].length) {
          if (this.field[newX + j]) {
            lineSeen = this.field[newX + j][newY + i] || lineSeen;
          }
        }
      }
    }

    return lineSeen;
  }

  render() {
    let toRender;

    const {robot, world} = this.props;

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
      <div>
        {toRender}
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  robot: SimulatorSelectors.getRobot(appState),
  world: SimulatorSelectors.getWorld(appState)
});

const mapDispatchToProps = {
  loadImage: s_loadImage
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);
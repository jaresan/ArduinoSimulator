import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertWorldCoordsToFieldCoords } from 'reducers/worldReducer';

import * as Settings from 'constants/world';

import './Robot.css';
import RobotImage from 'assets/robot.png';

class Robot extends Component {

  constructor(props) {
    super(props);
    this.state = {dimensions: {}};
    this.boundOnImgLoad = this.onImgLoad.bind(this);
  }

  onImgLoad({target:img}) {
    this.setState({
      dimensions: {
        height: img.offsetHeight,
        width: img.offsetWidth
      }
    });
  }

  render() {
    const data = this.props.data;
    const dimensions = this.state.dimensions;

    const {x, y} = convertWorldCoordsToFieldCoords(
      this.props.data.getIn(['position', 'x']),
      this.props.data.getIn(['position', 'y'])
    );


    // ctx.rect(-data.get('wheelBase') / 2 * Settings.PIXELS_PER_M, -data.get('wheelBase') / 2 * Settings.PIXELS_PER_M, 0.05 * Settings.PIXELS_PER_M, data.get('wheelBase') * Settings.PIXELS_PER_M);

    return <img
      alt="Robot"
      className="Robot"
      src={RobotImage}
      style={{
        top: `${y - dimensions.height / 2}px`,
        left: `${x - dimensions.width / 2}px`,
      }}
      onLoad={this.boundOnImgLoad}
    />;
  }
}

Robot.propTypes = {
  data: PropTypes.object.isRequired
};

export default Robot;
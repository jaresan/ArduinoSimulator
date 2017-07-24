import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Settings from 'constants/world';

import './Canvas.css';

class Canvas extends Component {

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    this.drawTrack(ctx);
    // this.drawRobot(ctx);
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  drawTrack(ctx, scale = 1) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const field = this.props.field;
    const drawPixel = (x, y) => {
      ctx.fillStyle = "rgba(0, 0, 0, 100)";
      ctx.fillRect(x, y, 1, 1);
    };

    for (let i = 0; i < field[0].length; i += scale) {
      for (let j = 0; j < field.length; j += scale) {
        if (field[j][i]) {
          drawPixel(j / scale, i / scale);
        }
      }
    }
  }


  drawRobot(ctx) {
    const robot = this.props.robot;

    const {x, y} = this.props.convertWorldCoordsToFieldCoords(
      robot.getIn(['position', 'x']),
      robot.getIn(['position', 'y'])
    );

    ctx.fillStyle = 'rgba(150, 0, 0, 100)';

    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x, y);
    // rotate the rect
    ctx.rotate(robot.rotation * Math.PI / 180);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    // so the rect needs to be offset accordingly when drawn
    ctx.rect(-robot.wheelBase / 2 * Settings.PIXELS_PER_M, -robot.wheelBase / 2 * Settings.PIXELS_PER_M, 0.05 * Settings.PIXELS_PER_M, robot.wheelBase * Settings.PIXELS_PER_M);

    ctx.fillStyle = 'gold';
    ctx.fill();

    // restore the context to its untranslated/unrotated state
    ctx.restore();

    const sensors = robot.get('sensorPositions');

    sensors.forEach(coords => {
      ctx.fillStyle = 'rgba(10, 50, 200, 100)';
      ctx.rect(coords.x, coords.y, 4, 4);
    });

    ctx.fill();
  }

  render() {
    return (
      <div className="canvasContainer">
        <canvas
          ref='canvas'
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

Canvas.propTypes = {
  robot: PropTypes.object.isRequired,
  field: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Canvas;
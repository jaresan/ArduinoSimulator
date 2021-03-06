import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertWorldCoordsToFieldCoords } from 'reducers/worldReducer';
import { AutoSizer } from 'react-virtualized';

import * as Settings from 'constants/world';

import './Canvas.css';

class Canvas extends Component {

  updateCanvas() {
    const ctx = this.robotCanvas.getContext('2d');
    // ctx.scale(this.props.scale, this.props.scale);
    this.drawRobot(ctx);
  }

  componentDidMount() {
    const ctx = this.trackCanvas.getContext('2d');
    // ctx.scale(this.props.scale, this.props.scale);
    this.drawTrack(ctx);
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  drawTrack(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const field = this.props.field;
    const drawPixel = (x, y) => {
      ctx.fillStyle = "rgba(0, 0, 0, 100)";
      ctx.fillRect(x, y, 1, 1);
    };

    for (let i = 0; i < field[0].length; i++) {
      for (let j = 0; j < field.length; j++) {
        if (field[j][i]) {
          drawPixel(j, i);
        }
      }
    }
  }

  drawRobotSensors(ctx) {
    ctx.save();
    const robot = this.props.robot;
    const sensors = robot.get('sensorPositions');

    sensors.forEach(([x, y]) => {
      const pos = convertWorldCoordsToFieldCoords(x, y);
      ctx.rect(pos.x, pos.y, 4, 4);
    });

    ctx.fill();
    ctx.restore();
  }

  drawRobotBody(ctx) {
    ctx.save();
    const robot = this.props.robot;
    const {x, y} = convertWorldCoordsToFieldCoords(
      robot.getIn(['position', 'x']),
      robot.getIn(['position', 'y'])
    );

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x, y);
    // rotate the rect
    ctx.rotate(robot.get('rotation') * Math.PI / 180);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    // so the rect needs to be offset accordingly when drawn
    const rectSize = -robot.get('wheelBase') / 2 * Settings.PIXELS_PER_M;
    const robotHeight = robot.get('wheelBase') * Settings.PIXELS_PER_M;
    const robotWidth = 0.05 * Settings.PIXELS_PER_M;
    ctx.rect(rectSize, rectSize, robotWidth, robotHeight);

    ctx.restore();
  }

  drawRobot(ctx) {
    const {width, height} = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0, 0, 150, 100)';
    this.drawRobotBody(ctx);
    this.drawRobotSensors(ctx);
  }


  render() {
    const {width, height} = this.props;

    return (
      <AutoSizer>
        {({width: styleWidth, height: styleHeight}) => {
          const ratio = styleWidth / width;
          let newWidth = styleWidth;
          let newHeight = height * ratio;
          if (newHeight >= styleHeight) {
            newWidth = width * styleHeight / height;
            newHeight = styleHeight;
          }
          return (
            <div className="canvasContainer">
              <canvas
                ref={(canvas) => this.robotCanvas = canvas}
                className="robotCanvas"
                width={width}
                height={height}
                style={{
                  width: newWidth,
                  height: newHeight
                }}
              />
              <canvas
                ref={(canvas) => this.trackCanvas = canvas}
                className="trackCanvas"
                width={width}
                height={height}
                style={{
                  width: newWidth,
                  height: newHeight
                }}
              />
            </div>
          );
        }}
      </AutoSizer>
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
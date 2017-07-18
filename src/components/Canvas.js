import React, { Component } from 'react';
import Robot from 'model/Robot';
import World from 'model/World';

import * as Settings from '../constants/WorldSettings';

class Canvas extends Component {

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    this.drawRobot(ctx);
    this.drawTrack(ctx);
  }

  drawRobot() {

  }

  drawTrack() {

  }


  drawRobot(ctx, robot) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const {x, y} = World.convertWorldCoordsToFieldCoords(
      robot.position.x,
      robot.position.y
    );

    const sensors = robot.sensorDeltas.map(([deltaX, deltaY]) => {
      const [x, y] = robot.getSensorPosition(deltaX, deltaY);
      return World.convertWorldCoordsToFieldCoords(x, y);
    });

    ctx.fillStyle = 'rgba(150, 0, 0, 100)';
    //ctx.rect(x, y, Math.abs(x - sensors[2].x), robot.wheelBase * Settings.PIXELS_PER_M);

    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate( x, y);
    // rotate the rect
    ctx.rotate(robot.rotation * Math.PI/180);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    // so the rect needs to be offset accordingly when drawn
    ctx.rect( -robot.wheelBase/2 * Settings.PIXELS_PER_M, -robot.wheelBase/2* Settings.PIXELS_PER_M, 0.05 * Settings.PIXELS_PER_M, robot.wheelBase * Settings.PIXELS_PER_M);

    ctx.fillStyle='gold';
    ctx.fill();

    // restore the context to its untranslated/unrotated state
    ctx.restore();

    sensors.forEach(coords => {
      ctx.fillStyle = 'rgba(10, 50, 200, 100)';
      ctx.rect(coords.x, coords.y, 4, 4);
    });

    ctx.fill();
  }

  animate(robotParams, world, speedCoeff) {
    const robot = new Robot(robotParams);
    const wrapper = document.createElement('div');
    wrapper.setAttribute('id','canvasWrapper');
    wrapper.setAttribute('style', 'position:relative');
    document.body.appendChild(wrapper);

    const backgroundCanvas = world.drawWorld();
    backgroundCanvas.setAttribute('id', 'canvas1');
    backgroundCanvas.setAttribute('style', 'z-index: 1; position:absolute; left:0px; top:0px;');

    const foregroundCanvas = document.createElement('canvas');
    foregroundCanvas.setAttribute('id', 'canvas2');
    foregroundCanvas.setAttribute('style', 'z-index: 2; position:absolute; left:0px; top:0px;');
    foregroundCanvas.width = backgroundCanvas.width;
    foregroundCanvas.height = backgroundCanvas.height;

    wrapper.appendChild(backgroundCanvas);
    wrapper.appendChild(foregroundCanvas);

    const ctx = foregroundCanvas.getContext('2d');
    setInterval(() => {
      // world.drawWorld(1, ctx);
      for (let i = 0; i < speedCoeff; i++) {
        robot.tick(world);
      }
      this.drawRobot(ctx, robot, world);
    },10);
  }
  
  render() {
    return <canvas ref='canvas' width={300} height={300}/>;
  }
}

export default Canvas;
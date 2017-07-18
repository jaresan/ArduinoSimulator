import * as Settings from 'constants/WorldSettings';

class World {

  /**
   * @param imageData Image data (width, height, array of pixels).
   * @param realWorldWidth Real track width in metres.
   * @param realWorldHeight Real track height in metres/
   */
  constructor(imageData, realWorldWidth, realWorldHeight) {
    const {width, height, pixels} = imageData;

    const fieldWidth = realWorldWidth * Settings.PIXELS_PER_M;
    const fieldHeight = realWorldHeight * Settings.PIXELS_PER_M;
    const stepX = width / fieldWidth;
    const stepY = height / fieldHeight;

    this.field = [];
    for (let i = 0; i < fieldWidth; i++) {
      this.field[i] = [];
      this.field[i][fieldHeight - 1] = 0;
    }

    for (let i = 0; i < fieldHeight; i++) {
      const indexY = Math.min(Math.floor(i * stepY), height - 1);
      for (let j = 0; j < fieldWidth; j++) {
        const indexX = Math.min(Math.floor(j * stepX), width - 1);
        this.field[j][i] = pixels[indexX][indexY] !== 255 ? 1 : 0;
      }
    }
  }

  drawWorld(scale = 1, ctx2) {
    const field = this.field;

    let canvas, ctx = ctx2;
    if (!ctx2) {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      canvas.width = field.length / scale;
      canvas.height = field[0].length / scale;
    }

    function drawPixel(x, y) {
      ctx.fillStyle = 'rgba(0, 0, 0, 100)';
      ctx.fillRect(x, y, 1, 1);
    }

    for (let i = 0; i < field[0].length; i += scale) {
      for (let j = 0; j < field.length; j += scale) {
        if (field[j][i]) {
          drawPixel(j / scale, i / scale);
        }
      }
    }

    return canvas;
  }

  /**
   * Converts real world coordinates (specified in meters) to pixel world representation.
   *
   * @param x X coord in real world in metres.
   * @param y Y coord in real world in metres.
   * @param radius rotation in degrees
   */
  static convertWorldCoordsToFieldCoords(x, y, radius) {
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
    let {x: newX, y: newY, radius: newRadius} = World.convertWorldCoordsToFieldCoords(x, y, radius);
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

}

export default World;
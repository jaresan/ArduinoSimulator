import { fromJS } from 'immutable';
import { r_setImageData } from 'actions/worldActions';
import * as Settings from 'constants/WorldSettings';

export const initialState = fromJS({
  pixels: [],
  width: 0,
  height: 0
});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case r_setImageData.type:
      const {imageData, realWorldWidth, realWorldHeight} = payload;
      const {width, height, pixels} = imageData;

      const fieldWidth = realWorldWidth * Settings.PIXELS_PER_M;
      const fieldHeight = realWorldHeight * Settings.PIXELS_PER_M;
      const stepX = Math.floor(fieldWidth / width);
      const stepY = Math.floor(fieldHeight / height);

      const field = [];
      for (let i = 0; i < width; i++) {
        field[i] = [];
        field[i][height - 1] = 0;
      }

      for (let i = 0; i < height; i += stepY) {
        const indexY = Math.min(i, height - 1);
        for (let j = 0; j < width; j += stepX) {
          const indexX = Math.min(j, width - 1);
          field[j][i] = pixels[indexX][indexY] !== 255 ? 1 : 0;
        }
      }

      return state
        .set('pixels', field)
        .set('width', width)
        .set('height', height);

    default:
      return state;
  }
};